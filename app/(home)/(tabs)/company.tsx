import {CompanyForm} from '@/components/company/company-form';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {router} from "expo-router";
import {Companies} from "@/services/database/models";
import {Company} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import {TopButtons} from "@/components/top-buttons";
import {csvToDb, dataToCsv, getVersion, loadTextFromFile, MimeTypes, saveTextToFile} from "@/utils/utils";

export default function CompanyPage() {
    const db = useSQLiteContext();
    const getData = () => (Companies.all(db)?.at(0) || {}) as Company;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Company>();

    const refreshData = () => {
        setData(getData());
    }

    const handleSave = (values: Company) => {
        Companies.save(db, values);
        refreshData();
        router.back();
    };

    const handleImport = async () => {
        const csv = await loadTextFromFile(MimeTypes.csv);
        setIsLoading(true);
        if (csv) csvToDb(db, 'company', csv);
        setIsLoading(false);
        setData({} as Company);
        refreshData();
        router.back();
    }

    const handleExport = async () => {
        setIsLoading(true);
        const content = dataToCsv([data]);
        await saveTextToFile(content, `company${getVersion()}.csv`, MimeTypes.csv);
        setIsLoading(false);
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TopButtons
                create={false}
                onImport={handleImport}
                onExport={handleExport}
            />
            {data && <CompanyForm company={data} onSave={handleSave}/> }
            <ActivityIndicator size="large" animating={isLoading}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});