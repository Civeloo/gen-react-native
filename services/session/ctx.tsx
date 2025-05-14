import { useStorageState } from '@/hooks/useStorageState';
import { createContext, useContext, type PropsWithChildren } from 'react';
// import { firebaseAuthState, firebaseGoogleSignIn, firebaseSignIn, firebaseSignOut, firebaseSignUp } from '../firebase/firebase.auth';

type Sign = (email: string, password: string) => void;
type AuthContextProps = {
  authState: () => void;
  signIn: Sign;
  signUp: Sign;
  googleSignIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextProps>({
  authState: () => null,
  signIn: () => null,
  signUp: () => null,
  googleSignIn: () => null,
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
        authState: () => {
          // firebaseAuthState().then((user) => {
          //   setSession(user ? user.uid : null);
          // });
        },
        signIn: (email, password) => {
          // firebaseSignIn(email, password)
          //   .then((user) => {
          //     setSession(user ? user.uid : null);
          //   });
        },
        signUp: (email, password) => {
          // firebaseSignUp(email, password)
          //   .then((user) => {
          //     setSession(user ? user.uid : null);
          //   });
        },
        googleSignIn: (token) => {
          // firebaseGoogleSignIn(token)
          //   .then((user) => {
          //     setSession(user ? user.uid : null);
          //   });
        },
        signOut: () => {
          // firebaseSignOut()
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
