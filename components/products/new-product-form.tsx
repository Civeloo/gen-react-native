import { getLocalizedText } from '@/languages/languages';
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet, View } from 'react-native';
import * as yup from "yup";
import { TextInputController } from '../text-input-controller';

const schema = yup
  .object({
    productName: yup.string().max(50).required(),
    unit: yup.string().max(50).required(),
    price: yup.number().min(0).required(),
  })
  .required();

type FormValues = yup.InferType<typeof schema>

type NewProductFormProps = {
  onSave: (data: FormValues) => void;
};

export const NewProductForm: React.FC<NewProductFormProps> = ({ onSave }) => {
  const { ...methods } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(data);
    methods.reset();
  };

  const FormContent = (
    <View>
      <TextInputController
        name="productName"
        placeholder={getLocalizedText('product-name-placeholder')}
        keyboardType="default"
      />
      <TextInputController
        name="unit"
        placeholder={getLocalizedText('unit-placeholder')}
        keyboardType="default"
      />
      <TextInputController
        name="price"
        placeholder={getLocalizedText('price-placeholder')}
        keyboardType="numeric"
      />
      <Button title="+" onPress={methods.handleSubmit(onSubmit)} />
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
    marginTop: 10,
    width: 200,
  },
});
