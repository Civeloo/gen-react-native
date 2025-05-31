import React, {useEffect, useState} from 'react';
import {SignInForm} from "@/components/auth/sign-in-form";
import {Link, useRouter} from "expo-router";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {getLocalizedText} from "@/languages/languages";
import {BackButton} from "@/components/back-button";
import {useSession} from '@/services/session/ctx';
import {GOOGLE_SIGN_IN_WEB_CLIENT_ID} from "@/config";
import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const {errors, session, signIn, googleSignIn} = useSession();
    const router = useRouter();

    const handleOnSave = async (data: { email: string, password: string }) => {
        const {email, password} = data;
        setIsLoading(true);
        signIn(email, password);
        setIsLoading(false);
        if (session) router.replace('/');
    }

    const handleGoogleSignIn = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
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
        googleSignIn(idToken);
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_SIGN_IN_WEB_CLIENT_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    }, []);

    return (<View style={styles.container}>
        <BackButton onPress={() => router.replace('/')}/>
        <View style={styles.form}>
            <SignInForm onSave={handleOnSave}/>

            {errors &&
                <Text key={errors?.code} style={styles.errorText}>
                    {errors?.message}
                </Text>
            }
            {isLoading && <ActivityIndicator/>}
        </View>
        <View style={styles.questions}>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('sign_up_question')}</Text>
                <Link href='/sign-up'>
                    <Text style={styles.questionsText}>{getLocalizedText('sign_up')}</Text>
                </Link>
            </View>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('password_forgot')}</Text>
                <Link href='/forgot'>
                    <Text style={styles.questionsText}>{getLocalizedText('password_reset')}</Text>
                </Link>
            </View>
        </View>
        <View style={styles.buttons}>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleSignIn}
            />
        </View>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    form: {flex: 1},
    errorText: {
        color: "red",
        alignSelf: "center",
        textAlign: "center",
        maxWidth: 200,
    },
    questions: {
        gap: 10,
    },
    questionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    questionsText: {
        fontWeight: 'bold',
    },
    buttons: {
        marginTop: 10,
        alignSelf: 'center',
    }
});