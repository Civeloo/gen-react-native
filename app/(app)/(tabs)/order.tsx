import { ListOrder } from '@/components/orders/list-order';
import { AddOrder } from '@/components/orders/add-order';
import Orders from '@/services/database/orders.model';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function OrderPage() {
    const getData = () => Orders.all();
    const refreshData = () => setData(getData());

    const [data, setData] = useState(getData());
    const [addOrder, setAddOrder] = useState(false);

    const handleRemove = (id) => {
        Orders.removeWithRelationships(id, 'orderWithDetails');
        refreshData();
    };

    const handleSave = () => {
        setAddOrder(false);
        refreshData();
    };

    return (
        <View style={styles.container}>
            <Button
                title={addOrder ? "Cancel" : "+"}
                onPress={() => setAddOrder(!addOrder)}
                color={addOrder ? 'red' : '#2196F3'} />
            {addOrder
                ? <AddOrder onSave={handleSave} />
                : <ListOrder data={data} onRemove={handleRemove} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        // alignItems: "center",
        // justifyContent:"space-between",
        // height: "100%",
    },
});