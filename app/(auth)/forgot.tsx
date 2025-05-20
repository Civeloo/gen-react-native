import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {isClerkAPIResponseError, useSignIn} from "@clerk/clerk-expo";
import {useRouter} from 'expo-router'
import {ForgotForm} from "@/components/auth/forgot-form";
import {VerificationForm} from "@/components/auth/verification-form";

const ForgotPage: React.FC = () => {
    const [pendingVerification, setPendingVerification] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {isLoaded, signIn, setActive} = useSignIn();
    const router = useRouter();

    const handleOnSave = async (data) => {
        const {email} = data;

        if (!isLoaded) return;

        setIsLoading(true);

        setErrors([]);

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });
            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true);
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            if (isClerkAPIResponseError(err)) {
                setErrors(err?.errors);
            }
            // console.error(JSON.stringify(err, null, 2));
        }
        setIsLoading(false);
    }

    // Handle submission of verification form
    const handleOnVerify = async (data) => {
        const {code, password} = data;

        if (!isLoaded) return;

        setIsLoading(true);

        try {
            const signInAttempt = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({session: signInAttempt.createdSessionId});
                router.replace('/');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                // console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            if (isClerkAPIResponseError(err)) {
                setErrors(err?.errors);
            }
            // console.error(JSON.stringify(err, null, 2));
        }
        setIsLoading(false);
    }

    return (<View style={styles.container}>
        {pendingVerification ?
            <VerificationForm onSave={handleOnVerify} forgot/>
            :
            <ForgotForm onSave={handleOnSave}/>}
        {errors?.map((e) =>
            <Text key={e?.code} style={styles.errorText}>
                {e?.longMessage}
            </Text>
        )}
        {isLoading && <ActivityIndicator/>}
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    errorText: {
        color: "red",
        alignSelf: "center",
        textAlign: "center",
        maxWidth: 200,
    },
});

export default ForgotPage;
