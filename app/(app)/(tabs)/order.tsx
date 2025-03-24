import { AddOrder } from '@/components/orders/add-order';
import { ListOrder } from '@/components/orders/list-order';
import { getLocalizedText } from '@/languages/languages';
import Orders from '@/services/database/orders.model';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';

export default function OrderPage() {

    const getData = () => Orders.getNotCancelledOrders();
    const refreshData = () => {
        setData(getData());
        setSelected({});
    }

    const [data, setData] = useState(getData());
    const [selected, setSelected] = useState({});
    const [addOrder, setAddOrder] = useState(false);

    const handleRemove = () => {
        refreshData();
    };

    const handleSave = (orderCode:string) => {
        setAddOrder(false);
        refreshData();
        setSelected(orderCode);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={addOrder ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setAddOrder(!addOrder)}
                color={addOrder ? 'red' : '#2196F3'} />
            {addOrder
                ? <AddOrder onSave={handleSave} />
                : <ListOrder data={data} onRemove={handleRemove} selected={selected} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});