import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';

const schema = yup
    .object({
        email: yup.string().email().required()
    })
    .required();

type FormValues = yup.InferType<typeof schema>

export interface ForgotFormDataProps {
    email: string;
}

interface ForgotFormProps {
    onSave: (data: ForgotFormDataProps) => void
}

export const ForgotForm: React.FC<ForgotFormProps> = ({onSave}) => {
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
            <Button title={getLocalizedText('password_reset')} onPress={methods.handleSubmit(onSubmit)}/>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('password_forgot')}</Text>
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 50,
        paddingTop: 50,
        paddingBottom: 10,
    },
    title: {
        paddingHorizontal: 20,
        textAlign: 'center',
        fontSize: 56,
        fontWeight: 'bold',
    }
});