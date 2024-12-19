The [`@react-native-google-signin/google-signin`](https://github.com/react-native-google-signin/google-signin) library provides different ways, such as Firebase and Google API, to integrate Google authentication in your Expo app. It also provides native sign-in buttons and supports various authentication methods (standard, server-side validation, and offline access). You can use the library in your project by adding the [config plugin](https://docs.expo.dev/config-plugins/introduction) in the [app config](https://docs.expo.dev/versions/latest/config/app).

This guide provides additional information on how to configure the library for your project, and different steps might be required depending on the authentication method you choose.

## Prerequisites

The `@react-native-google-signin/google-signin` library can't be used in the Expo Go app because it requires custom native code. Learn more about [adding custom native code to your app](https://docs.expo.dev/workflow/customizing).

## Installation

See `@react-native-google-signin/google-signin` documentation for instructions on how to install and configure the library:

["React Native Google Sign In: Expo installation instructions](https://react-native-google-signin.github.io/docs/setting-up/expo)

## Configure Google project for Android and iOS

Below are instructions on how to configure your Google project for Android and iOS.

### Upload app to Google Play Store

We recommend uploading the app to the Google Play Store if your app still needs to be in production. It is not necessary to upload the complete app if your project is still in the development process. Upload a single instance of your app. This will allow you to sign your app with the required certificates, such as the SHA-1 certificate fingerprint, which is required when configuring the Google project for Android. To learn more about the app submission process, see the guides below in the order they are specified:

[Create your first EAS Build](https://docs.expo.dev/build/setup)

[Build your project for app stores](https://docs.expo.dev/deploy/build-project)

[Manually upload Android app for the first time](https://expo.fyi/first-android-submission)

Once you have uploaded your app, you can provide an SHA-1 certificate fingerprint value when asked while configuring the Google project. There are two values that you can provide from:

- Fingerprint of the **.apk** you built (on your machine or using EAS Build). You can find the SHA-1 certificate fingerprint in the Google Play Console under **Release** > **Setup** > **App Integrity** > **Upload key certificate**.
- Fingerprint of a **production app** downloaded from the play store. You can find the SHA-1 certificate fingerprint in the Google Play Console under **Release** > **Setup** > **App Integrity** > **App signing key certificate**.

```bash
cd android && ./gradlew signingReport
```
### With Firebase

For more instructions on how to configure your Google project for Android and iOS with Firebase:

[Firebase](https://react-native-google-signin.github.io/docs/setting-up/expo#expo-and-firebase)

#### Upload google-services.json and GoogleService-Info.plist to EAS

If you use the Firebase method for Android and iOS (as shared in sections above), you'll need to upload **google-services.json** and **GoogleService-Info.plist** to EAS and add them to **.gitignore** to avoid checking them in the repository.

[Upload a secret file to EAS and use in the app config](https://docs.expo.dev/build-reference/variables#how-to-upload-a-secret-file-and-use-it-in-my-app-config)

