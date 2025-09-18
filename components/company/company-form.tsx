import {getLocalizedText} from '@/languages/languages';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect} from 'react';
import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {Button, KeyboardAvoidingView, Platform, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import {TextInputController} from '../text-input-controller';
import {Company} from '@/types/types';
import {DropDownPicker} from '@/components/drop-down-picker';
import COUNTRIES from '@/languages/countries.json';
import STATES_AR from '@/languages/states-ar.json';
import CONCEPTS_AR from '@/languages/concepts-ar.json';

const getPoss = () => {
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
        companyContact: yup.string().max(50).required(),
        companyAddress: yup.string().max(100).defined(),
        companyCity: yup.string().max(50).defined(),
        companyState: yup.string().max(50).defined(),
        companyPostalCode: yup.string().max(50).defined(),
        companyCountry: yup.string().max(50).required(),
        companyConcept: yup.string().max(50).defined(),
        companyPhone: yup.string().max(50).defined(),
        companyTin: yup.string().max(50).required(),
        companyType: yup.string().max(50).defined(),
        companyPOS: yup.string().max(50).defined(),
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
            companyPOS: company?.companyPOS || '',
        }
    });

    const {reset, formState: {errors}} = methods;

    const companyCountry = methods.watch('companyCountry');

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        const companyValues = values as Company;
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
                <Text style={styles.label}>📮</Text>
                <TextInputController
                    name='companyPostalCode'
                    placeholder={getLocalizedText('postal_code_placeholder')}
                /></View>
            <View style={styles.dropDownPicker}>
                <Text style={styles.label}>🌎</Text>
                <View style={styles.dropDownInput}>
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
                    <View style={styles.error}>
                        {errors?.companyCountry &&
                            <Text style={styles.errorText}>{errors?.companyCountry.message}</Text>}
                    </View>
                </View>
            </View>
            {companyCountry === 'AR' ? <>
                    <View style={styles.dropDownPicker}>
                        <Text style={styles.label}>🏞</Text>
                        <View style={styles.dropDownInput}>
                            <Controller
                                control={methods.control}
                                rules={{required: true}}
                                render={({field: {onChange, value}}) => (
                                    <DropDownPicker
                                        data={STATES_AR}
                                        placeholder={getLocalizedText('state_placeholder')}
                                        onChange={onChange}
                                        value={value}
                                    />
                                )}
                                name='companyState'
                            />
                            <View style={styles.error}>
                                {errors?.companyState &&
                                    <Text style={styles.errorText}>{errors?.companyState.message}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={styles.dropDownPicker}>
                        <Text style={styles.label}>🧾</Text>
                        <View style={styles.dropDownInput}>
                            <Controller
                                control={methods.control}
                                rules={{required: true}}
                                render={({field: {onChange, value}}) => (
                                    <DropDownPicker
                                        data={CONCEPTS_AR}
                                        placeholder={getLocalizedText('concept_placeholder')}
                                        onChange={onChange}
                                        value={value}
                                    />
                                )}
                                name='companyConcept'
                            />
                            <View style={styles.error}>
                                {errors?.companyConcept &&
                                    <Text style={styles.errorText}>{errors?.companyConcept.message}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={styles.dropDownPicker}>
                        <Text style={styles.label}>🏪</Text>
                        <View style={styles.dropDownInput}>
                            <Controller
                                control={methods.control}
                                rules={{required: true}}
                                render={({field: {onChange, value}}) => (
                                    <DropDownPicker
                                        data={getPoss()}
                                        placeholder={getLocalizedText('pto_vta_placeholder')}
                                        onChange={onChange}
                                        value={value}
                                    />
                                )}
                                name='companyPOS'
                            />
                            <View style={styles.error}>
                                {errors?.companyPOS &&
                                    <Text style={styles.errorText}>{errors?.companyPOS.message}</Text>}
                            </View>
                        </View>
                    </View>
                </>
                :
                <View style={styles.input}>
                    <Text style={styles.label}>🏞</Text>
                    <TextInputController
                        name='companyState'
                        placeholder={getLocalizedText('state_placeholder')}
                    /></View>
            }
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
            {/*<View style={styles.input}>
                <Text style={styles.label}>🏢</Text>
                <TextInputController
                    name='companyType'
                    placeholder={getLocalizedText('type_placeholder')}
                /></View>*/}
            {/*<Text style={styles.errorText}>{JSON.stringify(errors)}</Text>*/}
            <View style={styles.okButton}>
                <Button title={getLocalizedText('ok')} onPress={methods.handleSubmit(onSubmit)}/>
            </View>
        </View>
    );

    useEffect(() => {
        if (company) {
            reset(company);
        }
    }, [company, reset]);

    return (
        <View style={styles.container}>
            <FormProvider {...methods}>
                {Platform.OS == 'web' ? (
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {FormContent}
                    </form>
                ) : (<KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboarAvoidingView}>
                        {FormContent}
                    </KeyboardAvoidingView>
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
    },
    label: {
        fontSize: 28,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    dropDownPicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        // marginBottom: 20,
    },
    dropDownInput: {
        width: '100%',
        flexDirection: 'column',
    },
    okButton: {
        flex: 1,
        marginBottom: 40
    },
    error: {
        height: 20,
    },
    errorText: {
        color: 'red',
    },
    keyboarAvoidingView: {
        flex: 1,
        // paddingBottom: 10
    }
});