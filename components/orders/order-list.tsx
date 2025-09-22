import {getLocalizedText} from "@/languages/languages";
import Customers from "@/services/database/customers.model";
import {FC, useEffect, useState} from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchList} from "../search-list";
import Ionicons from '@expo/vector-icons/Ionicons';
import {Companies} from "@/services/database/models";
import {Company, Customer, Invoice, Order, OrderDetail} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import OrderDetails from "@/services/database/orderDetail.model";

type Props = {
    data: Order[];
    selected: {};
    onRemove: (orderDetails: OrderDetail[]) => void;
    onWsp: (invoice: Invoice) => void;
    onPrint: (invoice: Invoice) => void;
    onFile: (invoice: Invoice) => void;
    onRefresh: () => void;
};

export const OrderList: FC<Props> = ({data, selected, onRemove, onWsp, onPrint, onFile, onRefresh}) => {
    const [selectedOrder, setSelectedOrder] = useState({});

    const db = useSQLiteContext();

    const handleRemove = (orderDetails: OrderDetail[]) => {
        onRemove(orderDetails);
    };

    const renderItem = ({item}: { item: Order }) => {
        const order = item;
        const orderDetails = OrderDetails.where(db, [{
            key: 'orderID',
            value: order.orderID,
            condition: '='
        }]) as OrderDetail[];
        const customer = Customers.byId(db, order?.customerID).at(0) as Customer;
        const customerName = String(customer?.customerName || getLocalizedText('cash_customer'));
        const total = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.orderDetailPrice * orderDetail.orderDetailQuantity, 0);
        const orderCode = order?.orderCode;
        const orderDate = order?.orderDate;
        const customerContact = customer?.customerContact || '';
        const details: string[] = [];
        const company = Companies.all(db)?.at(0) as Company;
        const invoice: Invoice = {order, orderDetails, customer, company, total};
        return (
            <View style={styles.order}>
                <View style={styles.header}>
                    <Text style={styles.title}>{customerName}</Text>
                    <Text style={styles.detail}>{orderCode}</Text>
                    <Text style={styles.date}>{orderDate.split('T')[0]}</Text>
                    {!order.orderSignature && <Button
                        title="  -  "
                        color="red"
                        onPress={() => handleRemove(orderDetails)}/>}
                </View>
                <View style={styles.detailList}>
                    {orderDetails.map((orderDetail: OrderDetail) => {
                        const detail = `${orderDetail.orderDetailName} x ${orderDetail.orderDetailQuantity} - $ ${(orderDetail.orderDetailPrice * orderDetail.orderDetailQuantity).toFixed(2)}`;
                        details.push(detail);
                        return (
                            <Text key={orderDetail.orderDetailName + orderDetail.productID} style={styles.detail}>
                                {detail}
                            </Text>
                        );
                    })}
                </View>
                <View style={styles.cardFooter}>
                    {customerContact && <TouchableOpacity
                        onPress={() => onWsp(invoice)}>
                        <Ionicons name="logo-whatsapp" size={32} color="green"/>
                    </TouchableOpacity>}
                    {/*{user && !!arcaGetToken(user.email || '') &&*/}
                    <TouchableOpacity testID='print' onPress={() => onPrint(invoice)}>
                        <Ionicons name='print' size={32}/>
                    </TouchableOpacity>
                    <TouchableOpacity testID='file' onPress={() => onFile(invoice)}>
                        <Ionicons name='document-text' size={32}/>
                    </TouchableOpacity>
                    {/*}*/}
                    <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
                </View>
            </View>);
    };

    useEffect(() => {
        setSelectedOrder({});
    }, [data]);

    useEffect(() => {
        setSelectedOrder(selected);
    }, [selected]);

    return (
        <View style={styles.container}>
            <SearchList
                id='orderID'
                data={data}
                selected={selectedOrder}
                elementKey="orderCode"
                placeholder={getLocalizedText('search_orders')}
                renderItem={renderItem}
                onRefresh={() => onRefresh()}
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
    cardFooter: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
