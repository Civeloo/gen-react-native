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
import {Customer, Order, Product, OrderCode, OrderDetail} from '@/types/types';
import {useSQLiteContext} from 'expo-sqlite';

type Props = {
    onSave: (orderCode: string) => void;
};

export const OrderAdd: React.FC<Props> = (props) => {
    const {onSave} = props;

    const db = useSQLiteContext();

    const getProducts = () => Products.all(db) as Product[];
    const getCustomers = () => Customers.all(db) as Customer[];

    const [availableProducts, setAvailableProducts] = useState<Product[]>(getProducts());
    const [customers, setAvailableCustomers] = useState<Customer[]>(getCustomers());
    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: number }>({customer0: 1});
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});

    const refreshProducts = () => setAvailableProducts(getProducts());
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
        Object.entries(selectedProducts).forEach(([productID, quantity]) => {
            const product = availableProducts.find((p) => p.productID === productID) as Product;
            Products.update(db, {productID, productQuantity: product.productQuantity - quantity} as Product);
            const orderDetail = {
                orderID,
                productID,
                orderDetailName: product.productName,
                orderDetailPrice: product.productPrice,
                orderDetailQuantity:quantity,
            } as OrderDetail;
            OrderDetails.add(db, orderDetail);
        });
        onSave(newOrderCode);
    };

    const handleSelectCustomer = (customerId: string) => {
        setSelectedCustomer({[customerId]: 1});
    };

    const handleAddProduct = (productId: string) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
        }));
    };

    const calculateTotal = () => {
        return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
            const product = availableProducts.find((p) => p.productID === productId) as Product;
            return total + (product ? product.productPrice * quantity : 0);
        }, 0);
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts((prev) => {
            const newSelected = {...prev};
            if (newSelected[productId] > 1) {
                newSelected[productId]--;
            } else {
                delete newSelected[productId];
            }
            return newSelected;
        });
    };

    const renderProductItem = ({item}: { item: Product }) => (
        <View style={styles.productItem}>
            <Text style={styles.itemText}>{item.productName}</Text>
            <Text style={styles.itemText}>${item.productPrice.toFixed(2)}</Text>
            <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => handleRemoveProduct(item.productID)} style={styles.quantityButton}>
                    <Text style={styles.increaseDecrease}>{'-'}</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{selectedProducts[item.productID] || 0}</Text>
                <TouchableOpacity onPress={() => handleAddProduct(item.productID)} style={styles.quantityButton}>
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

    useEffect(() => {
        refreshProducts();
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
                <SearchList
                    id='productID'
                    data={availableProducts}
                    selected={selectedProducts}
                    elementKey='productName'
                    placeholder={getLocalizedText('search_products')}
                    renderItem={renderProductItem}
                    onRefresh={() => refreshProducts()}
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