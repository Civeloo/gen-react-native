import { TextInputController } from '@/components/text-input-controller';
import { getLocalizedText } from '@/languages/languages';
import { useSession } from '@/services/session/ctx';
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from 'expo-router';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import * as yup from "yup";

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
    const { signUp } = useSession();

    const { ...methods } = useForm<FormValues>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const { email, password } = data;
        methods.reset();
        signUp(email, password);
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
            <TextInputController
                name='confirm'
                label={getLocalizedText('confirm')}
                placeholder={getLocalizedText('confirm_placeholder')}
                keyboardType='visible-password'
                secureTextEntry
            />
            <Button title={getLocalizedText('sign-up')} onPress={methods.handleSubmit(onSubmit)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('sign-up')}</Text>
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
