import {CompanyForm} from '@/components/company/company-form';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {router} from "expo-router";
import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import {getLocalizedText} from "@/languages/languages";

export default function CompanyPage(props: object) {
    const db = useSQLiteContext();
    const getData = () => Companies.all(db)?.at(0) as Company;

    const [data, setData] = useState<Company>();

    console.info(data)
    const refreshData = () => {
        setData(getData());
    }

    const handleSave = (values: Company) => {
        Companies.save(db, values);
        refreshData();
        router.back();
    };

    useEffect(() => {
        refreshData();
    }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {data ? <CompanyForm company={data} onSave={handleSave}/>
                :
                <Button
                    title={getLocalizedText("create")}
                    onPress={() => setData({} as Company)}
                />
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});