import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {getLocalizedText} from "@/languages/languages";
import {router} from "expo-router";
import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";
import {arcaGetCSR, arcaGetToken, arcaRegister, arcaSendCRT} from "@/services/taxes/arca";
import {useSession} from "@/services/session/ctx";

export default function TaxesPage(props: object) {
    const [company, setCompany] = useState<Company>();
    const [token, setToken] = useState<boolean>();

    const {user} = useSession();
    const email = String(user?.email);
    const password = String(user?.uid);
    if (!email || !password) {
        alert(getLocalizedText('sign_in_please'));
        router.back();
    }

    const getData = () => Companies.all()?.at(-1) as Company;

    const refreshData = () => {
        setCompany(getData());
    }

    const refreshToken = () => {
        setToken(!!arcaGetToken());
    }

    const handleGenerate = async () => {
        const companyTin = company?.tin;
        const companyName = company?.companyName;
        const companyContact = company?.contact;
        const companyCountry = company?.country;
        if (!companyTin || !companyName || !companyContact || !companyCountry) return alert(getLocalizedText('company_complete'));
        if (!token) await arcaRegister(email, password);
        await arcaGetCSR(email, password, companyTin, companyContact, companyName, companyCountry);
    }

    const handleCertificate = async () => {
        if (!token) return alert(getLocalizedText('csr_please'));
        await arcaSendCRT(email);
    }

    useEffect(() => {
        refreshData();
        refreshToken();
    }, [props]);

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button
                    title={getLocalizedText('csr_generate')}
                    onPress={handleGenerate}
                />
                {token && <Button
                    title={getLocalizedText('crt_use')}
                    onPress={handleCertificate}
                />}
            </View>
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