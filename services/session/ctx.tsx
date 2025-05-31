import {useStorageState} from '@/hooks/useStorageState';
import {createContext, type PropsWithChildren, useContext, useState} from 'react';
import {
    firebaseAuthState,
    firebaseGoogleSignIn, firebaseReset,
    firebaseSignIn,
    firebaseSignOut,
    firebaseSignUp,
} from '@/services/firebase/firebase.auth';
import {getLocalizedText} from "@/languages/languages";
import {User} from "@firebase/auth-types";

type Sign = (email: string, password: string) => void;
type AuthContextProps = {
    authState: () => void;
    signIn: Sign;
    signUp: Sign;
    googleSignIn: (token: string) => void;
    signOut: () => void;
    reset: (email: string) => void;
    session?: string | null;
    isLoading: boolean;
    errors: {
        code?: string;
        message?: string;
    }|null;
};

const AuthContext = createContext<AuthContextProps>({
    authState: () => null,
    signIn: () => null,
    signUp: () => null,
    googleSignIn: () => null,
    signOut: () => null,
    reset: () => null,
    session: null,
    isLoading: false,
    errors: null
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

export function SessionProvider({children}: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [errors, setErrors] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                authState: () => {
                    firebaseAuthState().then((user: User | any) => {
                        setSession(user ? user.uid : null);
                    });
                },
                signIn: (email, password) => {
                    firebaseSignIn(email, password)
                        .then((user) => {
                            setErrors(null);
                            setSession(user ? user.uid : null);
                        }).catch((err) => {
                        if (err.code != "auth/email-not-verified")
                            err['message'] = getLocalizedText('sign_password_error');
                        setErrors(err);
                    });
                },
                signUp: (email, password) => {
                    firebaseSignUp(email, password)
                        .then((res) => {
                            setErrors(res);
                        }).catch((err) => {
                        setErrors(err);
                    });
                },
                googleSignIn: (token) => {
                    firebaseGoogleSignIn(token)
                        .then((user) => {
                            setSession(user ? user.uid : null);
                        });
                },
                signOut: () => {
                    firebaseSignOut();
                    setSession(null);
                },
                reset: (email) => {
                    firebaseReset(email).then();
                },
                session,
                errors,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
