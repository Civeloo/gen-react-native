import React from 'react';
import {SignInForm} from "@/components/sign-in/sign-in-form";
import {Link, useRouter} from "expo-router";
import {useSignIn} from "@clerk/clerk-expo";
import {StyleSheet, Text, View} from "react-native";
import {getLocalizedText} from "@/languages/languages";
import {BackButton} from "@/components/back-button";

const SignInPage: React.FC = () => {
    const router = useRouter();
    const {signIn, setActive, isLoaded} = useSignIn();

    const handleOnSave = async (data) => {
        const {email, password} = data;

        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
            })
            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({session: signInAttempt.createdSessionId});
                router.replace('/');
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    }
    return (<View style={styles.container}>
        <BackButton  onPress={()=> router.replace('/')}/>
        <SignInForm onSave={handleOnSave}/>
        <View style={styles.questions}>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('sign-up-question')}</Text>
                <Link href='/sign-up'>
                    <Text style={styles.questionsText}>{getLocalizedText('sign-up')}</Text>
                </Link>
            </View>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('password_forgot')}</Text>
                <Link href='/forgot'>
                    <Text style={styles.questionsText}>{getLocalizedText('password_reset')}</Text>
                </Link>
            </View>
        </View>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
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
    }
});

export default SignInPage;