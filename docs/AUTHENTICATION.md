With Expo Router, all routes are always defined and accessible. You can use runtime logic to redirect users away from specific screens depending on whether they are authenticated. There are two different techniques for authenticating users within routes. This guide provides an example that demonstrates the functionality of standard native apps.

## Using React Context and Route Groups

It's common to restrict specific routes to users who are not authenticated. This is achievable in an organized way by using React Context and Route Groups. Consider the following project structure that has a `/sign-in` route that is always accessible and a `(app)` group that requires authentication:

+ app/_layout.tsx 
+ app/sign-in.tsx **Always accessible**
- app/(app)/_layout.tsx **Protects child routes**
- app/(app)/index.tsx **Requires authorization**

To follow the above example, set up a [React Context provider](https://react.dev/reference/react/createContext) that can expose an authentication session to the entire app. You can implement your custom authentication session provider or use the one from the **Example authentication context** below.

<Collapsible summary="Example authentication context">

This provider uses a mock implementation. You can replace it with your own [authentication provider](/guides/authentication/).

```tsx ctx.tsx
import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
```

The following code snippet is a basic hook that persists tokens securely on native with [`expo-secure-store`](/versions/latest/sdk/securestore) and in local storage on web.

{/* prettier-ignore */}
```tsx useStorageState.ts
import  { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then(value => {
        setState(value);
      });
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
```

Use the `SessionProvider` in the root layout to provide the authentication context to the entire app. It's imperative that the `<Slot />` is mounted before any navigation events are triggered. Otherwise, a runtime error will be thrown.

```tsx app/_layout.tsx
import { Slot } from 'expo-router';
import { SessionProvider } from '../ctx';

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
```

Create a nested [layout route](/router/layouts) that checks whether users are authenticated before rendering the child route components. This layout route redirects users to the sign-in screen if they are not authenticated.

```tsx app/(app)/_layout.tsx|collapseHeight=400
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
```

Create the `/sign-in` screen. It can toggle the authentication using `signIn()`. Since this screen is outside the `(app)` group, the group's layout and authentication check do not run when rendering this screen. This lets logged-out users see this screen.

```tsx app/sign-in.tsx|collapseHeight=480
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '../ctx';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
    </View>
  );
}
```

Implement an authenticated screen that lets users sign out.

```tsx app/(app)/index.tsx|collapseHeight=480
import { Text, View } from 'react-native';

import { useSession } from '../../ctx';

export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
```

You now have an app that can present a loading state while it checks the initial authentication state and redirects to the sign-in screen if the user is not authenticated. If a user visits a deep link to any routes with the authentication check, they'll be redirected to the sign-in screen.

## Alternative loading states

With Expo Router, something must be rendered to the screen while loading the initial auth state. In the example above, the app layout renders a loading message. Alternatively, you can make the `index` route a loading state and move the initial route to something such as `/home`, which is similar to how X works.

## Middleware

Traditionally, websites may leverage some form of server-side redirection to protect routes. Expo Router on the web currently only supports build-time static generation and has no support for custom middleware or serving. This can be added in the future to provide a more optimal web experience. In the meantime, authentication can be implemented by using client-side redirects and a loading state.