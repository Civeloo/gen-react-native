import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, View} from 'react-native';
import * as yup from "yup";
import {TextInputController} from '../text-input-controller';
import {cleanPhoneNumber} from "@/utils";

const schema = yup
    .object({
        customerName: yup.string().max(50).required(),
        // contactName: yup.string().max(50).required(),
        // okress: yup.string().max(50).required(),
        // city: yup.string().max(50).required(),
        // postalCode: yup.string().max(50).required(),
        // country: yup.string().max(50).required(),
        contact: yup.string().max(50).required(),
        tin: yup.string().max(50).required(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type NewCustomerFormProps = {
    customer: Customer;
    onSave: (values: FormValues, id?: string) => void;
    onRemove?: (id: string) => void;
};

export const CustomerForm: React.FC<NewCustomerFormProps> = ({customer, onSave, onRemove}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            customerName: customer.customerName || '',
            contact: customer.contact || '',
            tin: customer.tin || '',
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        values.contact = cleanPhoneNumber(values.contact);
        onSave(values, customer?.id);
        methods.reset();
    };

    const FormContent = (
        <View>
            <TextInputController
                name="customerName"
                placeholder={getLocalizedText('customer-name-placeholder')}
                keyboardType="default"
            />
            <TextInputController
                name="contact"
                placeholder={getLocalizedText('contact-placeholder')}
                keyboardType="default"
            />
            <TextInputController
                name="tin"
                placeholder={getLocalizedText('tin-placeholder')}
                keyboardType="default"
            />
            <View style={styles.buttons}>
                <View style={styles.okButton}>
                    <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
                </View>
                {onRemove && customer?.id && <Button
                    color="red"
                    title="  -  "
                    onPress={() => onRemove(customer?.id)}/>}
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
        color: 'gray',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    okButton: {flex: 1}
});