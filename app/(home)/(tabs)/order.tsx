import {OrderAdd} from '@/components/orders/order-add';
import {OrderList} from '@/components/orders/order-list';
import {getLocalizedText} from '@/languages/languages';
import Orders from '@/services/database/orders.model';
import {useState} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import {Order} from "@/types/types";
import {arcaInvoice, ArcaInvoiceProps} from "@/services/taxes/arca";
import {OrderCodes} from "@/services/database/models";

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

    const handleInvoice = async (invoice: ArcaInvoiceProps) => {
        const order = invoice.order;
        if (order.status === 'pending') {
            const signature = JSON.parse(await arcaInvoice(invoice));
            //TODO: si esta caido el server de afip alertar para reitentar
            if (signature === 'error') {
               console.error(signature)
                alert('SERVIDOR ARCA CAIDO REINTENTAR POR FAVOR')
                return;
            }
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
        //TODO: mostrar reporte
        refreshData();
    }


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
                    onInvoice={handleInvoice}
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