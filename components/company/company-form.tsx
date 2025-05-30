import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from "yup";
import {TextInputController} from '../text-input-controller';
import {Company} from "@/types/types";

const schema = yup
    .object({
        companyName: yup.string().max(50).required(),
        // address: yup.string().max(50).required(),
        // city: yup.string().max(50).required(),
        // postalCode: yup.string().max(50).required(),
        // country: yup.string().max(50).required(),
        // contact: yup.string().max(50).required(),
        // tin: yup.string().max(50).required(),
        companyType: yup.string().max(50).required(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type CompanyFormProps = {
    company: Company;
    onSave: (values: FormValues, id?: string) => void;
};

export const CompanyForm: React.FC<CompanyFormProps> = ({company, onSave}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            companyName: company?.companyName || '',
            // address: company?.address || '',
            // city: company?.city || '',
            // postalCode: company?.postalCode || '',
            // country: company?.country || '',
            // contact: company?.contact || '',
            // tin: company?.tin || '',
            companyType: company?.companyType || '',
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        values.companyType = values?.companyType?.toUpperCase() || 'USA';
        onSave(values, company?.id);
        // methods.reset();
    };

    const FormContent = (
        <View>
            <View style={styles.input}>
                <Text style={styles.label}>✏</Text>
                <TextInputController
                    name="companyName"
                    placeholder={getLocalizedText('company-name-placeholder')}
                    keyboardType="default"
                /></View>
            {/*<View style={styles.input}>
                <Text style={styles.label}>📞</Text>
                <TextInputController
                    name="contact"
                    placeholder={getLocalizedText('contact-placeholder')}
                    keyboardType="default"
                /></View>*/}
            {/*<View style={styles.input}>
                <Text style={styles.label}>🎫</Text>
                <TextInputController
                    name="tin"
                    placeholder={getLocalizedText('tin-placeholder')}
                    keyboardType="default"
                /></View>*/}
            <View style={styles.input}>
                <Text style={styles.label}>🌎</Text>
                <TextInputController
                    name="companyType"
                    placeholder={getLocalizedText('region-code-placeholder')}
                /></View>
            <View style={styles.okButton}>
                <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
            </View>
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
        marginTop: 20,
    },
    input: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 30,
        textAlign: "center",
    },
    okButton: {flex: 1}
});