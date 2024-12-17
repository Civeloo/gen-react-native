import { TextInputController } from '@/components/text-input-controller';
import { getLocalizedText } from '@/languages/languages';
import { useSession } from '@/services/session/ctx';
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from 'expo-router';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet, View } from 'react-native';
import * as yup from "yup";

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(8).max(16).required()
    })
    .required();

type FormValues = yup.InferType<typeof schema>

const SignInPage: React.FC = () => {
    const { signIn } = useSession();

    const { ...methods } = useForm<FormValues>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const { email, password } = data;
        methods.reset();
        signIn(email, password);
        // Navigate after signing in. You may want to tweak this to ensure sign-in is
        // successful before navigating.
        router.replace('/');
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
            <Button title={getLocalizedText('sign-in')} onPress={methods.handleSubmit(onSubmit)} />
        </View>
    );

    return (
        <View style={styles.container}>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default SignInPage;