import {OrderAdd} from '@/components/orders/order-add';
import {OrderList} from '@/components/orders/order-list';
import {getLocalizedText} from '@/languages/languages';
import Orders from '@/services/database/orders.model';
import {useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {Invoice, Order, OrderDetail} from "@/types/types";
import {arcaInvoice} from "@/services/taxes/arca";
import {OrderCodes} from "@/services/database/models";
import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import {genHtmlInvoice} from "@/utils/gen-html-invoice";
import {sendWhatsapp} from "@/utils/utils";
import {useSession} from "@/services/session/ctx";

export default function OrderPage() {

    const {user} = useSession();

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

    const signInvoice = async (invoice: Invoice) => {
        const {order, customer, total} = invoice;
        if (user && order.status === 'pending') {
            const arcaInvoiceProps = {
                user,
                order: invoice.order,
                customerTin: customer?.tin || '',
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
            const orderCodeLast = Number(OrderCodes.byId(customerCodeKey).orderNumber) || 0;
            if (orderNumber > orderCodeLast) OrderCodes.update(customerCodeKey, {orderNumber});
            order.orderCode = orderCode;
            order.signature = signature.cae.toString();
            order.expiration = signature.vto.toString();
            order.status = 'invoiced';
            Orders.update(order.id, {
                orderCode: order.orderCode,
                status: order.status,
                signature: order.signature,
                expiration: order.expiration
            });
        }
        return order;
    }

    const handleWsp = async (invoice: Invoice) => {
        const {orderDetails, customer, company, total} = invoice;
        const order = await signInvoice(invoice);
        if (!order) return;
        const details = orderDetails.map((orderDetail: OrderDetail) => {
            return `${orderDetail.productName} x ${orderDetail.quantity} - $ ${(orderDetail.price * orderDetail.quantity).toFixed(2)}`;
        })
        const customerContact = Number(customer.contact);
        if (customerContact) {
            const message = `${company?.companyName || ''}\n${order.orderCode}\n${order.orderDate.split('T')[0]}\n${details.join('\n')}\n$ ${total.toFixed(2)}
            \n${invoice.order.signature}`;
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