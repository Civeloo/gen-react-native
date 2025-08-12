import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from "yup";
import {TextInputController} from '../text-input-controller';
import {Customer} from "@/types/types";

const schema = yup
    .object({
        customerID: yup.string().defined(),
        customerName: yup.string().max(50).required(),
        // customerContactName: yup.string().max(50).required(),
        // companyAddress: yup.string().max(50).required(),
        // companyCity: yup.string().max(50).required(),
        // companyPostalCode: yup.string().max(50).required(),
        // companyCountry: yup.string().max(50).required(),
        customerContact: yup.string().max(50).required(),
        customerTin: yup.string().max(50).required(),
        customerType: yup.string().max(50).defined(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type CustomerFormProps = {
    customer: Customer;
    onSave: (values: Customer) => void;
    onRemove?: (customerID: string) => void;
};

export const CustomerForm: React.FC<CustomerFormProps> = ({customer, onSave, onRemove}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            customerID: customer?.customerID || '',
            customerName: customer?.customerName || '',
            customerContact: customer?.customerContact || '',
            customerTin: customer?.customerTin || '',
            customerType: customer?.customerType || '',
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        methods.reset();
        onSave(values);
    };

    const FormContent = (
        <View>
            <View style={styles.input}>
                <Text style={styles.label}>✏</Text>
                <TextInputController
                    name="customerName"
                    placeholder={getLocalizedText('customer_name_placeholder')}
                    keyboardType="default"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>📞</Text>
                <TextInputController
                    name="customerContact"
                    placeholder={getLocalizedText('contact_placeholder')}
                    keyboardType="default"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🎫</Text>
                <TextInputController
                    name="customerTin"
                    placeholder={getLocalizedText('tin_placeholder')}
                    keyboardType="default"
                /></View>
            <View style={styles.buttons}>
                <View style={styles.okButton}>
                    <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
                </View>
                {onRemove && customer?.customerID && <Button
                    color="red"
                    title="  -  "
                    onPress={() => onRemove(customer?.customerID)}/>}
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    okButton: {flex: 1}
});