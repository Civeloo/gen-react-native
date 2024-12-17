import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const authSignupPassword = async (email, password) => {
    const user = await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // ...
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            console.error(errorCode);
            const errorMessage = error.message;
            console.error(errorMessage);
            // ..
        });
    return user;
}

const authSigninPassword = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            console.error(errorCode);
            const errorMessage = error.message;
            console.error(errorMessage);
        });

const authStateListener = () =>
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

export { authSigninPassword, authSignupPassword, authStateListener };
