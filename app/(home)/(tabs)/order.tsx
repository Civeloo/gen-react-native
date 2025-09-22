import {OrderAdd} from '@/components/orders/order-add';
import {OrderList} from '@/components/orders/order-list';
import Orders from '@/services/database/orders.model';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {Invoice, Order, OrderCode, OrderDetail, Product} from "@/types/types";
import {arcaInvoice} from "@/services/taxes/arca";
import {OrderCodes} from "@/services/database/models";
import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import {genHtmlInvoice} from "@/utils/gen-html-invoice";
import {useSession} from "@/services/session/ctx";
import {csvToDb, dataToCsv, getVersion, loadTextFromFile, MimeTypes, saveTextToFile, sendWhatsapp} from "@/utils/utils";
import {useSQLiteContext} from "expo-sqlite";
import {TopButtons} from "@/components/top-buttons";
import {FECAESolicitarResult} from "@/types/fe-cae-solicitar";
import Products from "@/services/database/products.model";

export default function OrderPage() {
    const [isLoading, setIsLoading] = useState(false);

    const db = useSQLiteContext();

    const {user} = useSession();

    const getData = () => Orders.getNotCancelledOrders(db) as Order[];

    const refreshData = () => {
        setIsLoading(true);
        setData(getData());
        setSelected({});
        setIsLoading(false);
    }

    const [data, setData] = useState<Order[]>([]);
    const [selected, setSelected] = useState({});
    const [addOrder, setAddOrder] = useState(false);

    const handleRemove = (orderDetails: OrderDetail[]) => {
        // TODO: Cancelar factura en ARCA también
        setIsLoading(true);
        orderDetails.map((orderDetail: OrderDetail) => {
            const product = Products.byId(db, orderDetail.productID)?.at(0) as Product;
            Products.update(db, {
                productID: orderDetail.productID,
                productQuantity: product.productQuantity + orderDetail.orderDetailQuantity
            } as Product);
        });
        Orders.cancel(db, orderDetails[0]?.orderID);
        setIsLoading(false);
        refreshData();
    };

    const signInvoice = async (invoice: Invoice) => {
        const {order, customer, total} = invoice;
        if (user && order.orderStatus === 'pending') {
            setIsLoading(true);
            const arcaInvoiceProps = {
                user,
                order: invoice.order,
                customerTin: customer?.customerTin || '',
                total
            };
            const res = await arcaInvoice(arcaInvoiceProps) as FECAESolicitarResult;
            //TODO: si esta caido el server de afip alertar para reitentar
            if (!res || Object.keys(res).length === 0) {
                alert('SERVIDOR ARCA CAIDO REINTENTAR POR FAVOR');
                setIsLoading(false);
                return;
            }
            const signature = res.FeDetResp.FECAEDetResponse;
            const customerCodeKey = 'C';
            const orderNumber = signature.CbteDesde;
            const orderCode = customerCodeKey + orderNumber.toString();
            const orderCodes = OrderCodes.byId(db, customerCodeKey) as OrderCode[];
            const orderCodeLast = Number(orderCodes?.at(0)?.orderCodeNumber) || 0;
            const newOrderCode = {
                orderCodeID: customerCodeKey,
                orderCodeNumber: orderNumber
            } as OrderCode;
            if (!orderCodeLast) {
                OrderCodes.add(db, newOrderCode);
            } else {
                OrderCodes.save(db, newOrderCode);
            }
            order.orderCode = orderCode;
            order.orderSignature = signature.CAE.toString();
            order.orderExpiration = signature.CAEFchVto.toString();
            order.orderStatus = 'invoiced';
            const updateOrder = {
                orderID: order.orderID,
                orderCode: order.orderCode,
                orderStatus: order.orderStatus,
                orderSignature: order.orderSignature,
                orderExpiration: order.orderExpiration
            } as Order;
            Orders.update(db, updateOrder);
            setIsLoading(false);
            return  {...order, ...updateOrder} as Order;
        }
        return order;
    }

    const handleWsp = async (invoice: Invoice) => {
        const {order, orderDetails, customer, company, total} = invoice;
        const details = orderDetails.map((orderDetail: OrderDetail) => {
            return `${orderDetail.orderDetailName} x ${orderDetail.orderDetailQuantity} - $ ${(orderDetail.orderDetailPrice * orderDetail.orderDetailQuantity).toFixed(2)}`;
        });
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
        const html = genHtmlInvoice(invoice);
        await Print.printAsync({
            html
        });
        refreshData();
        setSelected(invoice.order.orderCode);
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

    const handleImport = async () => {
        const csv = await loadTextFromFile(MimeTypes.csv);
        setIsLoading(true);
        if (csv) csvToDb(db, 'orders', csv);
        setIsLoading(false);
        refreshData();
    }

    const handleExport = async () => {
        setIsLoading(true);
        const content = dataToCsv(data);
        await saveTextToFile(content, `orders${getVersion()}.csv`, MimeTypes.csv);
        setIsLoading(false);
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TopButtons
                create={addOrder}
                onCancel={() => setAddOrder(false)}
                onCreate={() => setAddOrder(true)}
                onImport={handleImport}
                onExport={handleExport}
            />
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
            <ActivityIndicator size="large" animating={isLoading}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
});