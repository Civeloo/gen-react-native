import { getLocalizedText } from "@/languages/languages";
import Customers from "@/services/database/customers.model";
import Orders from "@/services/database/orders.model";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SearchList } from "../search-list";

type Props = {
    data: Order[];
    onRemove: (id: string) => void;
};

export const ListOrder: React.FC<Props> = ({ data, onRemove }) => {
    const [selected, setSelected] = useState({});

    const renderItem = ({ item }: { item: Order }) => {
        const order = item;
        const orderDetails = Orders.inner(order?.id, 'orderWithDetails') as OrderDetails[];
        const customer = Customers.byId(order?.customerID);
        const customerName = customer?.customerName || getLocalizedText('cash-customer');
        const total = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.price * orderDetail.quantity, 0);
        return (
            <View style={styles.order}>
                <View style={styles.header}>
                    <Text style={styles.title}>{customerName}</Text>
                    <Text style={styles.detail}>{order?.orderCode}</Text>
                    <Text style={styles.date}>{order?.orderDate.split('T')[0]}</Text>
                    <Button
                        title="  -  "
                        color="red"
                        onPress={() => onRemove(order?.id)} />
                </View>
                <View style={styles.detailList}>
                    {orderDetails.map((orderDetail: OrderDetails) => (
                        <Text key={orderDetail.productName + orderDetail.productBarcode} style={styles.detail}>
                            {orderDetail.productName} x{orderDetail.quantity} - ${(orderDetail.price * orderDetail.quantity).toFixed(2)}
                        </Text>
                    ))}
                </View>
                <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            </View>);
    };

    return (
        <View style={styles.container}>
            <SearchList
                data={data}
                selected={selected}
                elementKey="orderCode"
                placeholder={getLocalizedText('search-orders')}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
    },
    order: {
        backgroundColor: 'silver',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        alignSelf: 'flex-end',
    },
    detailList: {
        marginTop: 8,
    },
    detail: {
        fontSize: 14,
        marginBottom: 4,
    },
});
