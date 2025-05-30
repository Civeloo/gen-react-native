import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword
} from "firebase/auth";
import {auth} from "@/services/firebase/firebase-config";
import {User} from "@firebase/auth-types";

interface FirebaseSignProps {
    (email: string, password: string): Promise<User | any>;
}

const firebaseSignUp: FirebaseSignProps = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => userCredential.user)
}

const firebaseSignIn: FirebaseSignProps = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => userCredential.user);

const firebaseGoogleSignIn = (token: string) =>
    signInWithCredential(auth, GoogleAuthProvider.credential(token))
        .then((result) => result.user);

const firebaseAuthState = () =>
    new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe();
                resolve(user);
            },
            (error) => {
                unsubscribe();
                reject(error);
            }
        );
    });

const firebaseSignOut = () => {
    auth.signOut();
    GoogleSignin.revokeAccess().then();
    GoogleSignin.signOut().then();
}

const firebaseReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
}

export {firebaseAuthState, firebaseGoogleSignIn, firebaseSignIn, firebaseSignOut, firebaseSignUp, firebaseReset};
