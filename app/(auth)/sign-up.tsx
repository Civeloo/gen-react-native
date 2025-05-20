import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {isClerkAPIResponseError, useSignUp} from "@clerk/clerk-expo";
import {useRouter} from 'expo-router'
import {SignUpForm} from "@/components/auth/sign-up-form";
import {VerificationForm} from "@/components/auth/verification-form";

const SignUpPage: React.FC = () => {
    const [pendingVerification, setPendingVerification] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {isLoaded, signUp, setActive} = useSignUp();
    const router = useRouter();

    const handleOnSave = async (data) => {
        const {email, password} = data;

        if (!isLoaded) return;

        setIsLoading(true);

        setErrors([]);

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: email,
                password,
            });
            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
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
        const {code} = data;

        if (!isLoaded) return;

        setIsLoading(true);

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });
            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({session: signUpAttempt.createdSessionId});
                router.replace('/');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                // console.error(JSON.stringify(signUpAttempt, null, 2));
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
            <VerificationForm onSave={handleOnVerify}/>
            :
            <SignUpForm onSave={handleOnSave}/>}
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

export default SignUpPage;
