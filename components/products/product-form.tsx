import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from "@hookform/resolvers/yup";
import React from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from "yup";
import {TextInputController} from '../text-input-controller';
import {Product} from "@/types/types";

const schema = yup
    .object({
        productID: yup.string().defined(),
        productName: yup.string().max(50).required(),
        // productUnit: yup.string().max(50).required(),
        productPrice: yup.string().required(),
        productQuantity: yup.string().required(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type ProductFormProps = {
    product: Product;
    onSave: (values: Product) => void;
    onRemove?: (productID: string) => void;
};

export const ProductForm: React.FC<ProductFormProps> = ({product, onSave, onRemove}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            productID: product.productID || '',
            productName: product?.productName || '',
            // productUnit: product?.productUnit || '',
            productPrice: String(product?.productPrice || ''),
            productQuantity: String(product?.productQuantity || ''),
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (values:FormValues) => {
        const productValues = {
            productID: values.productID,
            productName: values.productName,
            productPrice: Number(values.productPrice),
            productQuantity: Number(values.productQuantity),
        };
        onSave(productValues);
        methods.reset();
    };

    const FormContent = (
        <View>
            <View style={styles.input}>
                <Text style={styles.label}>✏</Text>
                <TextInputController
                    name="productName"
                    placeholder={getLocalizedText('product_name_placeholder')}
                    keyboardType="default"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>✖</Text>
                <TextInputController
                    name="productQuantity"
                    placeholder={getLocalizedText('quantity_placeholder')}
                    keyboardType="numeric"
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>💲</Text>
                <TextInputController
                    name="productPrice"
                    placeholder={getLocalizedText('price_placeholder')}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.buttons}>
                <View style={styles.okButton}>
                    <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
                </View>
                {onRemove && product?.productID && <Button
                    color="red"
                    title="  -  "
                    onPress={() => onRemove(product?.productID)}/>}
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