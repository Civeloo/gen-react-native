import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from "yup";
import {TextInputController} from '../text-input-controller';

const schema = yup
    .object({
        // id: yup.string(),
        productName: yup.string().max(50).required(),
        // unit: yup.string().max(50).required(),
        quantity: yup.number().required(),
        price: yup.number().required(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type NewProductFormProps = {
    product: Product;
    onSave: (values: Product) => void;
    onRemove?: (id: string) => void;
};

export const ProductForm: React.FC<NewProductFormProps> = ({product, onSave, onRemove}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            // id: product.id,
            productName: product.productName || '',
            quantity: product.quantity || '',
            price: product.price || '',
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        onSave(values, product?.id);
        methods.reset();
    };

    const FormContent = (
        <View>
            <View style={styles.input}>
                <Text style={styles.label}>✏</Text>
                <TextInputController
                    name="productName"
                    placeholder={getLocalizedText('product-name-placeholder')}
                    keyboardType="default"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>✖</Text>
                <TextInputController
                    name="quantity"
                    placeholder={getLocalizedText('quantity-placeholder')}
                    keyboardType="numeric"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>💲</Text>
                <TextInputController
                    name="price"
                    placeholder={getLocalizedText('price-placeholder')}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.buttons}>
                <View style={styles.okButton}>
                    <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
                </View>
                {onRemove && product?.id && <Button
                    color="red"
                    title="  -  "
                    onPress={() => onRemove(product?.id)}/>}
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