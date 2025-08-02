import {getLocalizedText} from "@/languages/languages";
import Customers from "@/services/database/customers.model";
import Orders from "@/services/database/orders.model";
import {FC, useEffect, useState} from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchList} from "../search-list";
import Products from "@/services/database/products.model";
import Ionicons from '@expo/vector-icons/Ionicons';
import {sendWhatsapp} from "@/utils";
import {Companies} from "@/services/database/models";
import {Company, Order, OrderDetail, Product} from "@/types/types";
import {arcaGetToken, ArcaInvoiceProps} from "@/services/taxes/arca";
import {useSession} from "@/services/session/ctx";

type Props = {
    data: Order[];
    selected: {};
    onRemove: () => void;
    onInvoice: (invoice: ArcaInvoiceProps) => void;
    onRefresh: () => void;
};

export const OrderList: FC<Props> = ({data, selected, onRemove, onInvoice, onRefresh}) => {
    const [selectedOrder, setSelectedOrder] = useState({});

    const {user} = useSession();

    const handleRemove = (orderDetails: OrderDetail[]) => {
        orderDetails.map((orderDetail: OrderDetail) => {
            const product = Products.byId(orderDetail.productID) as Product;
            Products.update(orderDetail.productID, {quantity: product.quantity + orderDetail.quantity});
        });
        Orders.cancel(orderDetails[0]?.orderID);
        onRemove();
    };

    const handleSendWsp = (orderCode: string, orderDate: string, total: number, details: any[], customerName: string | number | boolean, customerContact: string | number | boolean) => {
        const company = Companies.all()?.at(-1) as Company
        const message = `${company?.companyName || ''}\n${customerName}\n${orderCode}\n${orderDate.split('T')[0]}\n${details.join('\n')}\n$ ${total.toFixed(2)}`;
        sendWhatsapp(Number(customerContact), message);
    };

    const renderItem = ({item}: { item: Order }) => {
        const order = item;
        const orderDetails = Orders.inner(order?.id, 'orderWithDetails') as OrderDetail[];
        const customer = Customers.byId(order?.customerID);
        const customerName = String(customer?.customerName || getLocalizedText('cash_customer'));
        const customerTin = String(customer?.customerTin || '');
        const total = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.price * orderDetail.quantity, 0);
        const orderCode = order?.orderCode;
        const orderDate = order?.orderDate;
        const customerContact = customer?.contact || '';
        const details: string[] = [];

        const handleInvoice = () => {
            if (user) onInvoice({user, order, customerTin, total});
        };

        return (
            <View style={styles.order}>
                <View style={styles.header}>
                    <Text style={styles.title}>{customerName}</Text>
                    <Text style={styles.detail}>{orderCode}</Text>
                    <Text style={styles.date}>{orderDate.split('T')[0]}</Text>
                    <Button
                        title="  -  "
                        color="red"
                        onPress={() => handleRemove(orderDetails)}/>
                </View>
                <View style={styles.detailList}>
                    {orderDetails.map((orderDetail: OrderDetail) => {
                        const detail = `${orderDetail.productName} x ${orderDetail.quantity} - $ ${(orderDetail.price * orderDetail.quantity).toFixed(2)}`;
                        details.push(detail);
                        return (
                            <Text key={orderDetail.productName + orderDetail.productID} style={styles.detail}>
                                {detail}
                            </Text>
                        )
                    })}
                </View>
                <View style={styles.cardFooter}>
                    {customerContact && <TouchableOpacity
                        onPress={() => handleSendWsp(orderCode, orderDate, total, details, customerName, customerContact)}>
                        <Ionicons name="logo-whatsapp" size={32} color="green"/>
                    </TouchableOpacity>}
                    {user && !!arcaGetToken(user.email || '') &&
                        <TouchableOpacity testID='invoice' onPress={handleInvoice}>
                            <Ionicons name='document-text' size={32}/>
                        </TouchableOpacity>}
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
