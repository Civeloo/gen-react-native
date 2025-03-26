import {CompanyForm} from '@/components/company/company-form';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {getLocalizedText} from "@/languages/languages";
import {router} from "expo-router";
import {Company} from "@/services/database/models";

export default function CompanyPage(props) {
    const getData = () => Company.all();
    const refreshData = () => {
        setData(getData());
    }

    const [data, setData] = useState<Company[]>([]);

    const handleSave = (values: Company, id: string) => {
        Company.add(values, id);
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
            {data?.length > 0 && <CompanyForm company={data[0]} onSave={handleSave}/>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});