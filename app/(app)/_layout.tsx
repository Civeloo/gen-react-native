import { TITLE_VALUES, db, useAndStartPersister } from "@/services/database/database";
import { useSession } from "@/services/session/ctx";
import * as Crypto from 'expo-crypto';
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useCreateStore } from "tinybase/ui-react";

function RootLayout() {
  const { authState, session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  const IsLoading = () =>
    <View style={{ margin: 'auto' }}>
      <Text style={{ textAlign: 'center' }}>Loading...</Text>
    </View>;

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/home" />;
  }

  // Initialize the (memoized) TinyBase store and persist it.
  const store = useCreateStore(() => db);
  useAndStartPersister(store);
  const projectId = Crypto.randomUUID();
  store.setValue('currentProject', projectId)
  store.setValue(TITLE_VALUES, 'Todo App');

  useEffect(() => {
    authState();
  }, []);

  return (
    // Wrap the app in TinyBase context, so the store is default throughout and
    // a SafeAreaProvider/SafeAreaView so it fits the screen.
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {isLoading
            ?
            <IsLoading />
            :
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="+not-found" /> */}
            </Stack>}
          {/* <Text>{deviceLanguage}</Text> */}
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

let AppEntryPoint = RootLayout;

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
if (storybookEnabled) {
  AppEntryPoint = require("@/.storybook").default;
}

// Styles for the app.
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default AppEntryPoint;
