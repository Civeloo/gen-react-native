import {CustomerList} from '@/components/customers/customer-list';
import {CustomerForm} from '@/components/customers/customer-form';
import Customers from '@/services/database/customers.model';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {Company, Customer} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import {
    cleanPhoneNumber,
    csvToDb,
    dataToCsv,
    getCustomerCode,
    getVersion,
    loadTextFromFile,
    MimeTypes,
    saveTextToFile
} from "@/utils/utils";
import {Companies} from "@/services/database/models";
import {TopButtons} from "@/components/top-buttons";

export default function CustomerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const db = useSQLiteContext();
    const getData = () => Customers.all(db) as Customer[];
    const refreshData = () => {
        setIsLoading(true);
        setData(getData());
        setIsLoading(false);
    }

    const newCustomer = {} as Customer;
    const [data, setData] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState<Customer|null>();

    const handleSave = (values: Customer) => {
        setIsLoading(true);
        values.customerContact = cleanPhoneNumber(values.customerContact);
        const company = Companies.all(db).at(0) as Company;
        values.customerType = getCustomerCode(company?.companyType);
        Customers.save(db, values);
        setCustomer(null);
        refreshData();
        setIsLoading(false);
    };

    const handleRemove = (id: string) => {
        setIsLoading(true);
        Customers.remove(db, id);
        setCustomer(null);
        refreshData();
        setIsLoading(false);
    };

    const handleEdit = (item: Customer) => {
        setCustomer(item);
    };

    const handleImport = async () => {
        const csv = await loadTextFromFile(MimeTypes.csv);
        setIsLoading(true);
        if (csv) csvToDb(db, 'customers', csv);
        setIsLoading(false);
        refreshData();
    }

    const handleExport = async () => {
        setIsLoading(true);
        const content = dataToCsv(data);
        await saveTextToFile(content, `customers${getVersion()}.csv`, MimeTypes.csv);
        setIsLoading(false);
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TopButtons
                create={!!customer}
                onCancel={() => setCustomer(null)}
                onCreate={() => setCustomer(newCustomer)}
                onImport={handleImport}
                onExport={handleExport}
            />
            {customer
                ? <CustomerForm customer={customer} onSave={handleSave} onRemove={handleRemove}/>
                : <CustomerList
                    data={data}
                    onEdit={handleEdit}
                    onRefresh={() => refreshData()}/>
            }
            <ActivityIndicator size="large" animating={isLoading}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        // alignItems: "center",
    },
});