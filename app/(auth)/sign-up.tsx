import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as yup from "yup";
import {useSignUp} from "@clerk/clerk-expo";
import {useRouter} from 'expo-router'

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(8).max(16).required(),
        confirm: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
    })
    .required();

type FormValues = yup.InferType<typeof schema>

const SignUpPage: React.FC = () => {
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const {isLoaded, signUp, setActive} = useSignUp()
    const router = useRouter()

    const {...methods} = useForm<FormValues>({resolver: yupResolver(schema)});

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const {email, password} = data;

        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: email,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({strategy: 'email_code'})

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }

        methods.reset();
    };

    const FormContent = (
        <View>
            <TextInputController
                name='email'
                label={getLocalizedText('email')}
                placeholder={getLocalizedText('email_placeholder')}
                keyboardType='email-address'
            />
            <TextInputController
                name='password'
                label={getLocalizedText('password')}
                placeholder={getLocalizedText('password_placeholder')}
                keyboardType='visible-password'
                secureTextEntry
            />
            <TextInputController
                name='confirm'
                label={getLocalizedText('confirm')}
                placeholder={getLocalizedText('confirm_placeholder')}
                keyboardType='visible-password'
                secureTextEntry
            />
            <Button title={getLocalizedText('sign-up')} onPress={methods.handleSubmit(onSubmit)}/>
        </View>
    );

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({session: signUpAttempt.createdSessionId})
                router.replace('/');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
            <View>
                <Text>Verify your email</Text>
                <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress}>
                    <Text>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/*<Text style={styles.title}>{getLocalizedText('sign-up')}</Text>*/}
            <FormProvider {...methods}>
                {Platform.OS == 'web' ? (
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {FormContent}
                    </form>
                ) : (
                    FormContent
                )}
            </FormProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    title: {
        fontSize: 56,
        fontWeight: "bold",
    },
});

export default SignUpPage;
