import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import {TextInputController} from '../text-input-controller';
import {Company} from '@/types/types';
import {DropDownPicker} from '@/components/drop-down-picker';
import COUNTRIES from '@/languages/countries.json';

const CONCEPTS = [
    {
        'label': 'Productos',
        'value': '1'
    },
    {
        'label': 'Servicios',
        'value': '2'
    },
    {
        'label': 'Productos y  Servicios',
        'value': '3'
    },
];
const getPtoVtas = () => {
    const x = [];
    for (let i = 1; i < 10; i++) {
        const nro = String(i);
        x.push({
            'label': nro,
            'value': nro
        });
    }
    return x;
};

const schema = yup
    .object({
        companyID: yup.string().defined(),
        companyName: yup.string().max(50).required(),
        companyContact: yup.string().max(50).defined(),
        companyAddress: yup.string().max(100).defined(),
        companyCity: yup.string().max(50).defined(),
        companyState: yup.string().max(50).defined(),
        companyPostalCode: yup.string().max(50).defined(),
        companyCountry: yup.string().max(50).defined(),
        companyConcept: yup.string().max(50).defined(),
        companyPhone: yup.string().max(50).defined(),
        companyTin: yup.string().max(50).defined(),
        companyType: yup.string().max(50).defined(),
        companyPtoVta: yup.string().max(50).defined(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type CompanyFormProps = {
    company: Company;
    onSave: (values: Company) => void;
};

export const CompanyForm: React.FC<CompanyFormProps> = ({company, onSave}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            companyID: company?.companyID || '',
            companyName: company?.companyName || '',
            companyContact: company?.companyContact || '',
            companyAddress: company?.companyAddress || '',
            companyCity: company?.companyCity || '',
            companyState: company?.companyState || '',
            companyPostalCode: company?.companyPostalCode || '',
            companyCountry: company?.companyCountry || '',
            companyConcept: company?.companyConcept || '3',
            companyPhone: company?.companyPhone || '',
            companyTin: company?.companyTin || '',
            companyType: company?.companyType || '',
            companyPtoVta: company?.companyPtoVta || '',
        }
    });

    const companyCountry = methods.watch('companyCountry');

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        console.log('values',values);
        values.companyType = values?.companyType?.toUpperCase() || 'USA';
        const companyValues = values as Company;
        console.log('companyValues',companyValues);
        onSave(companyValues);
    };

    const FormContent = (
        <View>
            <View style={styles.input}>
                <Text style={styles.label}>✏</Text>
                <TextInputController
                    name='companyName'
                    placeholder={getLocalizedText('company_name_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🤵</Text>
                <TextInputController
                    name='companyContact'
                    placeholder={getLocalizedText('contact_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>📍</Text>
                <TextInputController
                    name='companyAddress'
                    placeholder={getLocalizedText('address_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏙</Text>
                <TextInputController
                    name='companyCity'
                    placeholder={getLocalizedText('city_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏞</Text>
                <TextInputController
                    name='companyState'
                    placeholder={getLocalizedText('state_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>📮</Text>
                <TextInputController
                    name='companyPostalCode'
                    placeholder={getLocalizedText('postal_code_placeholder')}
                /></View>
            <View style={styles.dropDownPicker}>
                <Text style={styles.label}>🌎</Text>
                <Controller
                    control={methods.control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                        <DropDownPicker
                            data={COUNTRIES}
                            placeholder={getLocalizedText('country_placeholder')}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                    name='companyCountry'
                />
            </View>
            <View style={styles.input}>
                <Text style={styles.label}>📞</Text>
                <TextInputController
                    name='companyPhone'
                    placeholder={getLocalizedText('phone_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🎫</Text>
                <TextInputController
                    name='companyTin'
                    placeholder={getLocalizedText('tin_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏢</Text>
                <TextInputController
                    name='companyType'
                    placeholder={getLocalizedText('type_placeholder')}
                /></View>
            {companyCountry === 'AR' && <>
                <View style={styles.dropDownPicker}>
                    <Text style={styles.label}>🧾</Text>
                    <Controller
                        control={methods.control}
                        rules={{required: true}}
                        render={({field: {onChange, value}}) => (
                            <DropDownPicker
                                data={CONCEPTS}
                                placeholder={getLocalizedText('concept_placeholder')}
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        name='companyConcept'
                    />
                </View>
                <View style={styles.dropDownPicker}>
                    <Text style={styles.label}>🏪</Text>
                    <Controller
                        control={methods.control}
                        rules={{required: true}}
                        render={({field: {onChange, value}}) => (
                            <DropDownPicker
                                data={getPtoVtas()}
                                placeholder={getLocalizedText('pto_vta_placeholder')}
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        name='companyPtoVta'
                    />
                </View>
            </>}
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
        gap: 10,
        // height:50
    },
    label: {
        fontSize: 28,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
        // alignSelf: 'center',
        // backgroundColor: 'yellow'
    },
    dropDownPicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    okButton: {
        flex: 1,
        marginBottom: 40
    }
});