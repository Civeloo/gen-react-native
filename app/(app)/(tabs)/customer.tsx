import { ListCustomer } from '@/components/customers/list-customer';
import { NewCustomerForm } from '@/components/customers/new-customer-form';
import Customers from '@/services/database/customers.model';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function CustomerPage() {
    const getData = () => Customers.all();
    const [data, setData] = useState(getData());
    const refreshData = () => setData(getData());
    const handleSave = (data) => {
        Customers.add(data);
        refreshData();
    };
    const handleRemove = (id) => {
        Customers.remove(id);
        refreshData();
    };
    return (
        <View style={styles.container}>
            <NewCustomerForm onSave={handleSave} />
            <ListCustomer data={data} onRemove={handleRemove} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        alignItems: "center",
    },
});