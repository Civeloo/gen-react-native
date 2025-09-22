import {getLocalizedText} from '@/languages/languages';
import Customers from '@/services/database/customers.model';
import {OrderCodes} from '@/services/database/models';
import OrderDetails from '@/services/database/orderDetail.model';
import Orders from '@/services/database/orders.model';
import Products from '@/services/database/products.model';
import {getDate, getUUIDv4} from '@/utils/utils';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SearchList} from '../search-list';
import {Customer, Order, OrderCode, OrderDetail, Product, SelectedProduct, SelectedProducts} from '@/types/types';
import {useSQLiteContext} from 'expo-sqlite';
import {SqlSearchList} from "@/components/sql-search-list";

type Props = {
    onSave: (orderCode: string) => void;
};
export const OrderAdd: React.FC<Props> = (props) => {
    const {onSave} = props;

    const db = useSQLiteContext();

    const getCustomers = () => Customers.all(db) as Customer[];

    const [customers, setAvailableCustomers] = useState<Customer[]>(getCustomers());
    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: number }>({customer0: 1});
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});

    const refreshCustomers = () => setAvailableCustomers(getCustomers());

    const handleSubmit = () => {
        const orderID = getUUIDv4();
        // const customer = customers.find((c) => Object.keys(selectedCustomer)[0] === c.id) as Customer;
        const orderCodeID = '#';//customer?.customerType;
        const orderCode = OrderCodes.byId(db, orderCodeID).at(0) as OrderCode;
        const orderCodeLast = Number(orderCode.orderCodeNumber) || 0;
        const orderCodeNumber = orderCodeLast + 1;
        const newOrderCode = orderCodeID + orderCodeNumber.toString();
        OrderCodes.update(db, {orderCodeID, orderCodeNumber} as OrderCode);
        const order: Order = {
            orderID,
            orderCode: newOrderCode,
            customerID: Object.keys(selectedCustomer)[0],
            orderDate: getDate(),
            orderStatus: 'pending',
        } as Order;
        Orders.add(db, order);
        Object.values(selectedProducts).forEach((selProduct: SelectedProduct) => {
            const {productID, productQuantity, productName, productPrice, qty} = selProduct;
            Products.update(db, {productID, productQuantity: productQuantity - qty});
            const orderDetail = {
                orderID,
                productID,
                orderDetailName: productName,
                orderDetailPrice: productPrice,
                orderDetailQuantity: qty,
            } as OrderDetail;
            OrderDetails.add(db, orderDetail);
        });
        onSave(newOrderCode);
    };

    const handleSelectCustomer = (customerId: string) => {
        setSelectedCustomer({[customerId]: 1});
    };

    const handleAddProduct = (product: Product) => {
        const productID = product?.productID;
        if (productID) {
            const selProduct = {...product, qty: 0};
            setSelectedProducts((prev) => ({
                ...prev,
                [productID]: {...selProduct, qty: (prev[productID]?.qty || 0) + 1},
            }));
        }
    };

    const handleRemoveProduct = (product: Product) => {
        const productID = product?.productID;
        if (productID)
            setSelectedProducts((prev) => {
                const newSelected = {...prev};
                if (newSelected[productID]?.qty > 1) {
                    newSelected[productID].qty--;
                } else {
                    delete newSelected[productID];
                }
                return newSelected;
            });
    };

    const calculateTotal = () =>
        Number(Object.values(selectedProducts).reduce((total, product) => {
            return Number(total) + (product ? product?.productPrice * product?.qty : 0);
        }, 0));

    const renderProductItem = ({item}: { item: Product }) => (
        <View style={styles.productItem}>
            <Text style={styles.itemText}>{item.productName}</Text>
            <Text style={styles.itemText}>${item.productPrice.toFixed(2)}</Text>
            <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => handleRemoveProduct(item)} style={styles.quantityButton}>
                    <Text style={styles.increaseDecrease}>{'-'}</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{selectedProducts[item.productID]?.qty || 0}</Text>
                <TouchableOpacity onPress={() => handleAddProduct(item)} style={styles.quantityButton}>
                    <Text style={styles.increaseDecrease}>{'+'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCustomerItem = ({item}: { item: Customer }) => (
        <TouchableOpacity onPress={() => handleSelectCustomer(item.customerID)}>
            <View style={
                selectedCustomer[item.customerID] ? styles.customerItemSelected : styles.customerItem
            }>
                <Text style={styles.itemText}>{item.customerName}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleSearch = (text: string) => {
        if (text) {
            const products = Products.where(db, [
                {key: 'productName', value: text, condition: 'LIKE'},
                {key: 'productBarcode', value: text, condition: '='}
            ]) as Product[];
            const product = products[0];
            const isBarcode = (text === product?.productBarcode);
            if (isBarcode) handleAddProduct(product);
            return products;
        }
    };

    useEffect(() => {
        refreshCustomers();
    }, [props]);

    return (
        <View style={styles.container}>
            <View>
                <SearchList
                    id='customerID'
                    data={customers}
                    selected={selectedCustomer}
                    elementKey='customerName'
                    placeholder={getLocalizedText('search_customers')}
                    renderItem={renderCustomerItem}
                    onRefresh={() => refreshCustomers()}
                />
                <SqlSearchList
                    id='productID'
                    selected={selectedProducts}
                    placeholder={getLocalizedText('search_products')}
                    renderItem={renderProductItem}
                    onSearch={handleSearch}
                />
            </View>
            <View>
                <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
                <Button title={getLocalizedText('process')} onPress={handleSubmit}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    customerItem: {
        padding: 12,
        marginBottom: 8
    },
    customerItemSelected: {
        backgroundColor: 'silver',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'silver',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    itemText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: 'gray',
        borderRadius: 4,
        padding: 8,
        marginHorizontal: 4,
    },
    quantityText: {
        minWidth: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    increaseDecrease: {
        color: 'white',
        height: 20,
        width: 20,
        textAlign: 'center',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 24,
    },
});