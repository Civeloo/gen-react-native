import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {getLocalizedText} from "@/languages/languages";
import {router} from "expo-router";
import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";
import {
    ARCA_HOMO,
    arcaGetCSR,
    arcaGetInvoiceLast,
    arcaGetToken,
    arcaGetValues,
    arcaLogin,
    arcaRegister,
    arcaSendCRT
} from "@/services/taxes/arca";
import {useSession} from "@/services/session/ctx";
import {useSQLiteContext} from "expo-sqlite";

export default function TaxesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [company, setCompany] = useState<Company>();
    const [token, setToken] = useState<string>('');

    const {user} = useSession();
    const email = String(user?.email);
    const password = String(user?.uid);
    if (!email || !password) {
        alert(getLocalizedText('sign_in_please'));
        router.back();
    }

    const db = useSQLiteContext();

    const getData = () => Companies.all(db)?.at(0) as Company;

    const refreshData = () => {
        setCompany(getData());
    }

    const refreshToken = async () => {
        setIsLoading(true);
        if (user) setToken(await arcaGetToken(email) || await arcaLogin({email, password}));
        setIsLoading(false);
    }

    const handleGetValues = async () => {
        setIsLoading(true);
        const values = await arcaGetValues(token);
        alert(values);
        setIsLoading(false);
    };

    const handleGetInvoiceLast = async () => {
        setIsLoading(true);
        const res = await arcaGetInvoiceLast(token);
        alert(res);
        setIsLoading(false);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        const companyTin = company?.companyTin;
        const companyName = company?.companyName;
        const companyContact = company?.companyContact;
        const companyCountry = company?.companyCountry;
        const companyConcept = company?.companyConcept || '';
        const companyPtoVta = company?.companyPtoVta || '';
        if (!companyTin || !companyName || !companyContact || !companyCountry || !companyConcept || !companyPtoVta) return alert(getLocalizedText('company_complete'));
        if (!token) {
            await arcaRegister(email, password).then(async () => {
                setToken(await arcaLogin({email, password}));
            });
        }
        await arcaGetCSR(token, companyTin, companyContact, companyName, companyCountry, companyConcept, companyPtoVta);
        setIsLoading(false);
    }

    const handleCertificate = async () => {
        setIsLoading(true);
        if (!token) return alert(getLocalizedText('csr_please'));
        await arcaSendCRT(email);
        setIsLoading(false);
        router.back();
    }

    useEffect(() => {
        refreshData();
        (async () => {
            await refreshToken()
        })();
    }, []);

    return (
        <View style={styles.container}>
            {company?.companyCountry === 'AR' ? <View style={styles.buttons}>
                {ARCA_HOMO.toLowerCase() === 'true' && <>
                    <Button
                        title={'Get Values'}
                        onPress={handleGetValues}
                    />
                    <Button
                        title={'Get Last Invoice'}
                        onPress={handleGetInvoiceLast}
                    />
                </>}
                <Button
                    title={getLocalizedText('csr_generate')}
                    onPress={handleGenerate}
                />
                {token && <Button
                    title={getLocalizedText('crt_use')}
                    onPress={handleCertificate}
                />}
            </View>
                : <Text>{company ? getLocalizedText('available_not') : getLocalizedText('company_complete')}</Text>}
            <ActivityIndicator size="large" animating={isLoading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    buttons: {
        alignSelf: 'center',
        gap: 10
    }
});