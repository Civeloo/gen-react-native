import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {getLocalizedText} from "@/languages/languages";
import {router} from "expo-router";
// import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";
import {arcaGetCSR, arcaGetToken, arcaRegister, arcaSendCRT} from "@/services/taxes/arca";
import {useSession} from "@/services/session/ctx";

export default function TaxesPage(props: object) {
    const [company, setCompany] = useState<Company>();
    const [token, setToken] = useState<string|null>();

    const {user} = useSession();
    const email = String(user?.email);
    const password = String(user?.uid);
    if (!email || !password) {
        alert(getLocalizedText('sign_in_please'));
        router.back();
    }

    const getData = () => [][0]/*Companies.all()?.at(-1)*/ as Company;

    const refreshData = () => {
        setCompany(getData());
    }

    const refreshToken = async() => {
        setToken(await arcaGetToken(email));
    }

    const handleGenerate = async () => {
        const companyTin = company?.companyID;
        const companyName = company?.companyName;
        const companyContact = company?.companyContact;
        const companyCountry = company?.companyCountry;
        const companyConcept = company?.companyConcept || '';
        const companyPtoVta = company?.companyPtoVta || '';
        if (!companyTin || !companyName || !companyContact || !companyCountry || companyConcept || companyPtoVta) return alert(getLocalizedText('company_complete'));
        if (!token) await arcaRegister(email, password);
        await arcaGetCSR(email, password, companyTin, companyContact, companyName, companyCountry, companyConcept, companyPtoVta);
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