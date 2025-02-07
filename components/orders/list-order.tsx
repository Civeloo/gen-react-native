import Orders from "@/services/database/orders.model";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

// A list component to show all the orders.
export const ListOrder = ({ data, onRemove }) => {
    const renderItem = ({ item }) => {
        const orderDetails = Orders.inner(item?.id, 'orderWithDetails') as OrderDetails[];
        const total = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.price * orderDetail.quantity, 0);
        return (
            <View style={styles.item}>
                <View style={styles.header}>
                    <Text style={styles.title}>{item['customerID']}</Text>
                    <Button
                        title="  -  "
                        color="red"
                        onPress={() => onRemove(item?.id)} />
                </View>
                <Text style={styles.date}>{item['orderDate']}</Text>
                <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
                <View style={styles.detailList}>
                    {orderDetails.map((orderDetail: OrderDetails) => (
                        <Text key={orderDetail.productID} style={styles.detail}>
                            {orderDetail.productID} x{orderDetail.quantity} - ${(orderDetail.price * orderDetail.quantity).toFixed(2)}
                        </Text>
                    ))}
                </View>
            </View>);
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
        minWidth: 200,
    },
    item: {
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
    },
    detailList: {
        marginTop: 8,
    },
    detail: {
        fontSize: 14,
        marginBottom: 4,
    },
});
