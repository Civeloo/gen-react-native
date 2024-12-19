import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const firebaseSignUp = async (email, password) => {
    const user = await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // ...
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    return user;
}

const firebaseSignIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

const firebaseGoogleSignIn = (token) =>
    signInWithCredential(auth, GoogleAuthProvider.credential(token))
        .then((result) => {
            // Signed in
            const user = result.user;
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

const firebaseAuthState = () =>
    new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe();
                resolve(user || null);
            },
            (error) => {
                unsubscribe();
                reject(error);
            }
        );
    });

const firebaseSignOut = () => {
    auth.signOut();
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
}

export { firebaseAuthState, firebaseGoogleSignIn, firebaseSignIn, firebaseSignOut, firebaseSignUp };
