import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import {useSignIn} from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(8).max(16).required()
    })
    .required();

type FormValues = yup.InferType<typeof schema>

const SignInPage: React.FC = () => {

    const {signIn, setActive, isLoaded} = useSignIn();
    const router = useRouter();

    const {...methods} = useForm<FormValues>({resolver: yupResolver(schema)});

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const {email, password} = data;

        methods.reset();

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
            <Button title={getLocalizedText('sign-in')} onPress={methods.handleSubmit(onSubmit)}/>
        </View>
    );

    return (<>
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('sign-in')}</Text>
            <FormProvider {...methods}>
                {Platform.OS == 'web' ? (
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {FormContent}
                    </form>
                ) : (
                    FormContent
                )}
            </FormProvider>

            <View style={styles.signUp}>
                <Text>{getLocalizedText('sign-up-question')}</Text>
                <Link href='/sign-up'>
                    <Text style={styles.signUpText}>{getLocalizedText('sign-up')}</Text>
                </Link>
            </View>
        </View>
    </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    title: {
        fontSize: 56,
        fontWeight: 'bold',
    },
    signUp: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
    },
    signUpText: {
        fontWeight: 'bold',
    }
});

export default SignInPage;