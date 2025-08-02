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
        companyName: yup.string().max(50).required(),
        contact: yup.string().max(50).defined(),
        address: yup.string().max(100).defined(),
        city: yup.string().max(50).defined(),
        state: yup.string().max(50).defined(),
        postalCode: yup.string().max(50).defined(),
        country: yup.string().max(50).defined(),
        concept: yup.string().max(50).defined(),
        phone: yup.string().max(50).defined(),
        tin: yup.string().max(50).defined(),
        type: yup.string().max(50).defined(),
        ptoVta: yup.string().max(50).defined(),
    })
    .required();

type FormValues = yup.InferType<typeof schema>

type CompanyFormProps = {
    company: Company;
    onSave: (values: Company, id?: string) => void;
};

export const CompanyForm: React.FC<CompanyFormProps> = ({company, onSave}) => {
    const {...methods} = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            companyName: company?.companyName || '',
            contact: company?.contact || '',
            address: company?.address || '',
            city: company?.city || '',
            state: company?.state || '',
            postalCode: company?.postalCode || '',
            country: company?.country || '',
            concept: company?.concept || '3',
            phone: company?.phone || '',
            tin: company?.tin || '',
            type: company?.type || '',
            ptoVta: company?.ptoVta || '',
        }
    });

    const country = methods.watch('country');

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        values.type = values?.type?.toUpperCase() || 'USA';
        const companyValues = values as Company;
        onSave(companyValues, company?.id);
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
                    name='contact'
                    placeholder={getLocalizedText('contact_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>📍</Text>
                <TextInputController
                    name='address'
                    placeholder={getLocalizedText('address_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏙</Text>
                <TextInputController
                    name='city'
                    placeholder={getLocalizedText('city_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏞</Text>
                <TextInputController
                    name='state'
                    placeholder={getLocalizedText('state_placeholder')}
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>📮</Text>
                <TextInputController
                    name='postalCode'
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
                    name='country'
                />
            </View>
            <View style={styles.input}>
                <Text style={styles.label}>📞</Text>
                <TextInputController
                    name='phone'
                    placeholder={getLocalizedText('phone_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🎫</Text>
                <TextInputController
                    name='tin'
                    placeholder={getLocalizedText('tin_placeholder')}
                    keyboardType='default'
                /></View>
            <View style={styles.input}>
                <Text style={styles.label}>🏢</Text>
                <TextInputController
                    name='type'
                    placeholder={getLocalizedText('type_placeholder')}
                /></View>
            {country === 'AR' && <>
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
                        name='concept'
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
                        name='ptoVta'
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