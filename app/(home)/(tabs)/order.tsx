import {OrderAdd} from '@/components/orders/order-add';
import {OrderList} from '@/components/orders/order-list';
import {getLocalizedText} from '@/languages/languages';
import Orders from '@/services/database/orders.model';
import {useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {Order} from "@/types/types";

export default function OrderPage() {

    const getData = () => Orders.getNotCancelledOrders() as Order[];

    const refreshData = () => {
        setData(getData());
        setSelected({});
    }

    const [data, setData] = useState<Order[]>([]);
    const [selected, setSelected] = useState({});
    const [addOrder, setAddOrder] = useState(false);

    const handleRemove = () => {
        refreshData();
    };

    const handleSave = (orderCode: string) => {
        setAddOrder(false);
        refreshData();
        setSelected(orderCode);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={addOrder ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setAddOrder(!addOrder)}
                color={addOrder ? 'red' : '#2196F3'}/>
            {addOrder
                ? <OrderAdd onSave={handleSave}/>
                : <OrderList
                    data={data}
                    onRemove={handleRemove}
                    selected={selected}
                    onRefresh={() => refreshData()}/>
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