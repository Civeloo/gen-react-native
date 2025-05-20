import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';

const schema = yup
    .object({
        code: yup.number().required()
    })
    .required();

type FormValues = yup.InferType<typeof schema>

interface VerificationFormProps {
    onSave: () => Promise<void>
}

export const VerificationForm: React.FC<VerificationFormProps> = ({onSave}) => {
    const {...methods} = useForm<FormValues>({resolver: yupResolver(schema)});

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        onSave(data);
        methods.reset();
    };

    const FormContent = (
        <View>
            <TextInputController
                name='code'
                label={getLocalizedText('verification_email')}
                placeholder={getLocalizedText('verification_placeholder')}
                keyboardType='numeric'
            />
            <Button title={getLocalizedText('verification')} onPress={methods.handleSubmit(onSubmit)}/>
        </View>
    );

    return (<>
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('verification')}</Text>
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
