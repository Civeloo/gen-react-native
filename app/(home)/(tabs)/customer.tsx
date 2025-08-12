import {CustomerList} from '@/components/customers/customer-list';
import {CustomerForm} from '@/components/customers/customer-form';
import {getLocalizedText} from '@/languages/languages';
import Customers from '@/services/database/customers.model';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {Company, Customer} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import {cleanPhoneNumber, getCustomerCode} from "@/utils/utils";
import {Companies} from "@/services/database/models";

export default function CustomerPage(props: object) {
    const db = useSQLiteContext();
    const getData = () => Customers.all(db) as Customer[];
    const refreshData = () => setData(getData());

    const newCustomer = {} as Customer;
    const [data, setData] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState<Customer|null>();

    const handleSave = (values: Customer) => {
        values.customerContact = cleanPhoneNumber(values.customerContact);
        const company = Companies.all(db).at(0) as Company;
        values.customerType = getCustomerCode(company?.companyType);
        Customers.save(db, values);
        setCustomer(null);
        refreshData();
    };

    const handleRemove = (id: string) => {
        Customers.remove(db, id);
        setCustomer(null);
        refreshData();
    };

    const handleEdit = (item: Customer) => {
        setCustomer(item);
    };

    useEffect(() => {
        refreshData();
    }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={customer ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setCustomer(customer ? null : newCustomer)}
                color={customer ? 'red' : '#2196F3'}/>
            {customer
                ? <CustomerForm customer={customer} onSave={handleSave} onRemove={handleRemove}/>
                : <CustomerList
                    data={data}
                    onEdit={handleEdit}
                    onRefresh={() => refreshData()}/>
            }
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