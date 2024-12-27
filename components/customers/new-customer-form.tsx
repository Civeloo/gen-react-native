import { getLocalizedText } from '@/languages/languages';
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet, View } from 'react-native';
import * as yup from "yup";
import { TextInputController } from '../text-input-controller';

const schema = yup
  .object({
    customerName: yup.string().max(50).required(),
    // contactName: yup.string().max(50).required(),
    // address: yup.string().max(50).required(),
    // city: yup.string().max(50).required(),
    // postalCode: yup.string().max(50).required(),
    // country: yup.string().max(50).required(),
    contact: yup.string().max(50).required(), 
    tin: yup.string().max(50).required(),
  })
  .required();

type FormValues = yup.InferType<typeof schema>

type NewCustomerFormProps = {
  onSave: (data: FormValues) => void;
};

export const NewCustomerForm: React.FC<NewCustomerFormProps> = ({ onSave }) => {
  const { ...methods } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(data);
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