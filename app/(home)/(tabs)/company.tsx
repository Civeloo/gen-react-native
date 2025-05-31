import {CompanyForm} from '@/components/company/company-form';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {getLocalizedText} from "@/languages/languages";
import {router} from "expo-router";
import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";

export default function CompanyPage(props: object) {
    const getData = () => Companies.all()?.at(-1);

    const [data, setData] = useState<Company>();

    const refreshData = () => {
        setData(getData() || {});
    }

    const handleSave = (values: { companyName: string; companyType: string; }, id?: string | undefined) => {
        Companies.add(values, id);
        refreshData();
        router.back();
    };

    useEffect(() => {
        refreshData();
    }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={getLocalizedText("cancel")}
                onPress={() => router.back()}
                color={'red'}/>
            {data && <CompanyForm company={data} onSave={handleSave}/>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});