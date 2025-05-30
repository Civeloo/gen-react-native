import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(8).max(16).required()
    })
    .required();

type FormValues = yup.InferType<typeof schema>

interface SignInFormProps {
    onSave: (data) => Promise<void>
}

export const SignInForm: React.FC<SignInFormProps> = ({onSave}) => {
    const {...methods} = useForm<FormValues>({resolver: yupResolver(schema)});

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        onSave(data);
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

        </View>
    </>);
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 50,
        paddingTop: 50,
        paddingBottom: 10,
    },
    title: {
        fontSize: 56,
        fontWeight: 'bold',
    }
});