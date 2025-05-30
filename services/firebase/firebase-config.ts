import { FIREBASE_CONFIG } from '@/config';
// import { Analytics } from "firebase/analytics";
import { getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
}; */
const firebaseConfig = FIREBASE_CONFIG;

let auth: Auth;
// let analytics: Analytics;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: (Platform?.OS === 'web') ? browserLocalPersistence : getReactNativePersistence(ReactNativeAsyncStorage),
  });
  // analytics = getAnalytics(app);
} else {
  auth = getAuth();
  // analytics = getAnalytics();
}
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth };
