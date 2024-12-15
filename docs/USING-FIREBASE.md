[Firebase](https://firebase.google.com/) is a Backend-as-a-Service (BaaS) app development platform that provides hosted backend services such as real-time database, cloud storage, authentication, crash reporting, analytics, and so on.
It is built on Google's infrastructure and scales automatically.

There are two different ways you can use Firebase in your projects:

- Using [Firebase JS SDK](#using-firebase-js-sdk)

## Prerequisites

Before proceeding, make sure that you have created a new Firebase project or have an existing one using the [Firebase console](https://console.firebase.google.com/).

## Using Firebase JS SDK

The [Firebase JS SDK](https://firebase.google.com/docs/web/setup) is a JavaScript library that allows you to interact with Firebase services in your project.
It supports services such as [Authentication](https://firebase.google.com/docs/auth), [Firestore](https://firebase.google.com/docs/firestore), [Realtime Database](https://firebase.google.com/docs/database), and [Storage](https://firebase.google.com/docs/storage) in a React Native app.

### When to use Firebase JS SDK

You can consider using the Firebase JS SDK when you:

- Want to use Firebase services such as Authentication, Firestore, Realtime Database, and Storage in your app and want to develop your app with [**Expo Go**](/get-started/set-up-your-environment/).
- Want a quick start with Firebase services.
- Want to create a universal app for Android, iOS, and the web.

#### Caveats

Firebase JS SDK does not support all services for mobile apps. Some of these services are Analytics, Dynamic Links and Crashlytics. See the [React Native Firebase](#using-react-native-firebase) section if you want to use these services.

### Install and initialize Firebase JS SDK

The following sub-sections use `firebase@9.x.x`. Expo SDK does not enforce or recommend any specific version of Firebase to use in your app.

If you are using an older version of the firebase library in your project, you may have to adapt the code examples to match the version that you are using with the help of the [Firebase JS SDK documentation](https://github.com/firebase/firebase-js-sdk).

#### Install the SDK

After you have created your [Expo project](/get-started/create-a-project/), you can install the Firebase JS SDK using the following command:

```bash
npx expo install firebase
```

#### Initialize the SDK in your project

To initialize the Firebase instance in your Expo project, you must create a config object and pass it to the `initializeApp()` method imported from the `firebase/app` module.

The config object requires an API key and other unique identifiers. To obtain these values, you will have to register a web app in your Firebase project. You can find these instructions in the [Firebase documentation](https://firebase.google.com/docs/web/setup#register-app).

After you have the API key and other identifiers, you can paste the following code snippet by creating a new **firebaseConfig.js** file in your project's root directory or any other directory where you keep the configuration files.

```js firebaseConfig.js
import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
```

You do not have to install other plugins or configurations to use Firebase JS SDK.

Firebase version 9 and above provide a modular API. You can directly import any service you want to use from the `firebase` package. For example, if you want to use an authentication service in your project, you can import the `auth` module from the `firebase/auth` package.

> **info** **Troubleshooting tip:** If you encounter issues related to authentication persistence with Firebase JS SDK, see the guide for [setting up persistence to keep users logged in between reloads](https://expo.fyi/firebase-js-auth-setup).

#### Configure Metro

> **info** If you are using Firebase version `9.7.x` and above, you need to add the following configuration to a **metro.config.js** file to make sure that the Firebase JS SDK is bundled correctly.

Expo CLI uses [Metro](https://metrobundler.dev/) to bundle your JavaScript code and assets, and add [support for more file extensions](/guides/customizing-metro/#adding-more-file-extensions-to--assetexts).

Start by generating the template file **metro.config.js** in your project's root directory using the following command:

```bash
npx expo customize metro.config.js
```

Then, update the file with the following configuration:

```js metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
```
