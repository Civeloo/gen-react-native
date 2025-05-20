import React, {useState} from 'react';
import {SignInForm} from "@/components/auth/sign-in-form";
import {Link, useRouter} from "expo-router";
import {isClerkAPIResponseError, useSignIn} from "@clerk/clerk-expo";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {getLocalizedText} from "@/languages/languages";
import {BackButton} from "@/components/back-button";

const SignInPage: React.FC = () => {
        const [errors, setErrors] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const {signIn, setActive, isLoaded} = useSignIn();
        const router = useRouter();

        const handleOnSave = async (data) => {
            const {email, password} = data;

            if (!isLoaded) return;

            setIsLoading(true);

            setErrors([]);

            // Start the sign-in process using the email and password provided
            try {
                const signInAttempt = await signIn.create({
                    identifier: email,
                    password,
                });
                // If sign-in process is complete, set the created session as active
                // and redirect the user
                if (signInAttempt.status === 'complete') {
                    await setActive({session: signInAttempt.createdSessionId});
                    router.replace('/');
                } else {
                    // If the status isn't complete, check why. User might need to
                    // complete further steps.
                    // console.error(JSON.stringify(signInAttempt, null, 2));
                }
            } catch (err) {
                // See https://clerk.com/docs/custom-flows/error-handling
                // for more info on error handling
                if (isClerkAPIResponseError(err)) {
                    const errs = err?.errors.map((e) => {
                            if (e.code === 'form_password_incorrect')
                                e['longMessage'] = getLocalizedText('sign_password_error');
                            return e;
                        }
                    );
                    setErrors(errs);
                }
                // console.error(JSON.stringify(err, null, 2));
            }
            setIsLoading(false);
        }

        return (<View style={styles.container}>
            <BackButton onPress={() => router.replace('/')}/>
            <View style={styles.form}>
                <SignInForm onSave={handleOnSave}/>
                {errors?.map((e) =>
                    <Text key={e?.code} style={styles.errorText}>
                        {e?.longMessage}
                    </Text>
                )}
                {isLoading && <ActivityIndicator/>}
            </View>
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
    }
;

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
    }
});

export default SignInPage;