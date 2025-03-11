import {ListCustomer} from '@/components/customers/list-customer';
import {CustomerForm} from '@/components/customers/customer-form';
import {getLocalizedText} from '@/languages/languages';
import Customers from '@/services/database/customers.model';
import {useEffect, useState} from 'react';
import {Button, StyleSheet, ScrollView} from 'react-native';

export default function CustomerPage(props) {
    const getData = () => Customers.all();
    const refreshData = () => setData(getData());

    const [data, setData] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState(false);

    const handleSave = (values: Customer, id: string) => {
        if (id) {
            Customers.add(values, id);
        } else {
            Customers.add(values);
        }
        setCustomer(false);
        refreshData();
    };

    const handleRemove = (id: string) => {
        Customers.remove(id);
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
                onPress={() => setCustomer(!customer)}
                color={customer ? 'red' : '#2196F3'}/>
            {customer
                ? <CustomerForm customer={customer} onSave={handleSave} onRemove={handleRemove}/>
                : <ListCustomer
                    data={data}
                    onRemove={handleRemove}
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