import {TextInputController} from '@/components/text-input-controller';
import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';

const schema = yup
    .object({
        code: yup.number().required(),
        password: yup
            .string()
            .min(8)
            .max(16)
            .when('$forgot', {
                is: true,
                then: schema => schema.required(),
                otherwise: schema => schema.notRequired(),
            }),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

interface VerificationFormProps {
    onSave: () => Promise<void>
    forgot?: boolean;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({onSave, forgot}) => {
    const {...methods} = useForm<FormValues>({resolver: yupResolver(schema, {context: {forgot: forgot}})});

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        onSave(data);
        methods.reset();
    };

    const FormContent = (
        <View>
            <TextInputController
                name='code'
                label={getLocalizedText('verify_email')}
                placeholder={getLocalizedText('verify_placeholder')}
                keyboardType='numeric'
            />
            {forgot && <TextInputController
                name='password'
                label={getLocalizedText('password_new')}
                placeholder={getLocalizedText('password_placeholder')}
                secureTextEntry
            />}
            <Button title={getLocalizedText('verify')} onPress={methods.handleSubmit(onSubmit)}/>
        </View>
    );

    return (<>
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('verify')}</Text>
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
