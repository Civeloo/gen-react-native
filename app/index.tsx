import { GOOGLE_SIGN_IN_WEB_CLIENT_ID } from "@/config";
import { getLocalizedText } from "@/languages/languages";
import { useSession } from "@/services/session/ctx";
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { session, googleSignIn } = useSession();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_SIGN_IN_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    // Try the new style of google-sign in result, from v13+ of that module
    let idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
    console.log('idToken', idToken)
    googleSignIn(idToken);
    router.replace(session ? '/(app)' : '/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getLocalizedText('CFBundleDisplayName')}</Text>
      <View style={styles.buttons}>
        <Button title={getLocalizedText('sign-in')} onPress={() => router.push("/sign-in")} />
        <Button title={getLocalizedText('sign-up')} onPress={() => router.push("/sign-up")} />
        <GoogleSigninButton
          // size={GoogleSigninButton.Size.Wide}
          // color={GoogleSigninButton.Color.Dark}
          onPress={onGoogleButtonPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
  },
  buttons: {
    gap: 20,
  }
});
