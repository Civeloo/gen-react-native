import {OrderAdd} from '@/components/orders/order-add';
import {OrderList} from '@/components/orders/order-list';
import {getLocalizedText} from '@/languages/languages';
import Orders from '@/services/database/orders.model';
import {useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {Invoice, Order, OrderCode, OrderDetail, Product} from "@/types/types";
import {arcaInvoice} from "@/services/taxes/arca";
import {OrderCodes} from "@/services/database/models";
import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import {genHtmlInvoice} from "@/utils/gen-html-invoice";
import {useSession} from "@/services/session/ctx";
import {sendWhatsapp} from "@/utils/utils";
import {useSQLiteContext} from "expo-sqlite";
import Products from "@/services/database/products.model";

export default function OrderPage() {

    const db = useSQLiteContext();

    const {user} = useSession();

    const getData = () => Orders.getNotCancelledOrders(db) as Order[];

    const refreshData = () => {
        setData(getData());
        setSelected({});
    }

    const [data, setData] = useState<Order[]>([]);
    const [selected, setSelected] = useState({});
    const [addOrder, setAddOrder] = useState(false);

    const handleRemove = (orderDetails: OrderDetail[]) => {
        orderDetails.map((orderDetail: OrderDetail) => {
            const product = Products.byId(db, orderDetail.productID).at(0) as Product;
            Products.update(db, {
                productID: orderDetail.productID,
                productQuantity: product.productQuantity + orderDetail.orderDetailQuantity
            } as Product);
        });
        Orders.cancel(db, orderDetails[0]?.orderID);
        refreshData();
    };

    const signInvoice = async (invoice: Invoice) => {
        const {order, customer, total} = invoice;
        if (user && order.orderStatus === 'pending') {
            const arcaInvoiceProps = {
                user,
                order: invoice.order,
                customerTin: customer?.customerTin || '',
                total
            };
            const res = await arcaInvoice(arcaInvoiceProps);
            //TODO: si esta caido el server de afip alertar para reitentar
            if (!res) {
                alert('SERVIDOR ARCA CAIDO REINTENTAR POR FAVOR')
                return;
            }
            const signature = JSON.parse(res);
            const customerCodeKey = 'C';
            const orderNumber = signature.nro;
            const orderCode = customerCodeKey + orderNumber.toString();
            const orderCodeLast = Number((OrderCodes.byId(db, customerCodeKey)?.at(0) as OrderCode).orderCodeNumber) || 0;
            if (orderNumber > orderCodeLast) OrderCodes.update(db, {
                orderCodeID: customerCodeKey,
                orderCodeNumber: orderNumber
            });
            order.orderCode = orderCode;
            order.orderSignature = signature.cae.toString();
            order.orderExpiration = signature.vto.toString();
            order.orderStatus = 'invoiced';
            Orders.update(db, {
                orderID: order.orderID,
                orderCode: order.orderCode,
                orderStatus: order.orderStatus,
                orderSignature: order.orderSignature,
                orderExpiration: order.orderExpiration
            });
        }
        return order;
    }

    const handleWsp = async (invoice: Invoice) => {
        const {orderDetails, customer, company, total} = invoice;
        const order = await signInvoice(invoice);
        if (!order) return;
        const details = orderDetails.map((orderDetail: OrderDetail) => {
            return `${orderDetail.orderDetailName} x ${orderDetail.orderDetailQuantity} - $ ${(orderDetail.orderDetailPrice * orderDetail.orderDetailQuantity).toFixed(2)}`;
        })
        const customerContact = Number(customer.customerContact);
        if (customerContact) {
            const message = `${company?.companyName || ''}\n${order.orderCode}\n${order.orderDate.split('T')[0]}\n${details.join('\n')}\n$ ${total.toFixed(2)}
            \n${invoice.order.orderSignature}`;
            sendWhatsapp(customerContact, message);
        } else alert('NEED PHONE NUMBER');
        refreshData();
        setSelected(order.orderCode);
    }

    const handlePrint = async (invoice: Invoice) => {
        const order = await signInvoice(invoice);
        if (!order) return;
        const inv = {...invoice, order};
        const html = genHtmlInvoice(inv);
        await Print.printAsync({html});
        refreshData();
        setSelected(order.orderCode);
    };

    const handleFile = async (invoice: Invoice) => {
        const order = await signInvoice(invoice);
        if (!order) return;
        const inv = {...invoice, order};
        const html = genHtmlInvoice(inv);
        const {uri} = await Print.printToFileAsync({html});
        await shareAsync(uri, {UTI: '.pdf', mimeType: 'application/pdf'});
        refreshData();
        setSelected(order.orderCode);
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
                    onWsp={handleWsp}
                    onPrint={handlePrint}
                    onFile={handleFile}
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