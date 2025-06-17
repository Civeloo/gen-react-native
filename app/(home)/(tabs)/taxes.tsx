import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
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
    const email = user?.email;
    const password = user?.uid;
    if (!email || !password) {
        alert("Please signup");
        router.back();
    }

    const getData = () => Companies.all()?.at(-1);

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
        if (!companyTin || !companyName || !companyContact || !companyCountry) return alert('Please complete all company values');
        if (!token) await arcaRegister(email, password);
        await arcaGetCSR(email, password, companyTin, companyContact, companyName, companyCountry);
    }

    const handleCertificate = async () => {
        if (!token) return alert('Generate CSR before');
        await arcaSendCRT(email);
    }

    useEffect(() => {
        refreshData();
        refreshToken();
    }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={getLocalizedText("cancel")}
                onPress={() => router.back()}
                color={'red'}/>
            <Button
                title={"generate csr"}
                onPress={handleGenerate}
            />
            {token && <Button
                title={"use certificate"}
                onPress={handleCertificate}
            />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});