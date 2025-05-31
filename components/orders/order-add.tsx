import {getLocalizedText} from '@/languages/languages';
import Customers from '@/services/database/customers.model';
import {OrderCodes} from '@/services/database/models';
import OrderDetails from '@/services/database/orderDetail.model';
import Orders from '@/services/database/orders.model';
import Products from '@/services/database/products.model';
import {getDate, getUUIDv4} from '@/utils';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SearchList} from '../search-list';
import {Customer, Product} from "@/types/types";

type Props = {
    onSave: (orderCode: string) => void;
};

export const OrderAdd: React.FC<Props> = (props) => {
    const {onSave} = props;

    const getProducts = () => Products.all() as Product[];
    const getCustomers = () => Customers.all() as Customer[];

    const [availableProducts, setAvailableProducts] = useState<Product[]>(getProducts());
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>(getCustomers());
    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: number }>({customer0: 1});
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});

    const refreshProducts = () => setAvailableProducts(getProducts());
    const refreshCustomers = () => setAvailableCustomers(getCustomers());

    const handleSubmit = () => {
        const orderID = getUUIDv4();
        // const customer = availableCustomers.find((c) => Object.keys(selectedCustomer)[0] === c.id) as Customer;
        const customerCodeKey = '#';//customer?.customerType;
        const orderCodeLast = Number(OrderCodes.byId(customerCodeKey).orderNumber) || 0;
        const orderNumber = orderCodeLast + 1;
        const orderCode = customerCodeKey + orderNumber.toString();
        OrderCodes.update(customerCodeKey, {orderNumber});
        const order = {
            orderCode: orderCode,
            customerID: Object.keys(selectedCustomer)[0],
            orderDate: getDate(),
        };
        Orders.add(order, orderID);
        Object.entries(selectedProducts).forEach(([productId, quantity]) => {
            const product = availableProducts.find((p) => p.id === productId) as Product;
            Products.update(productId, {quantity: product.quantity - quantity});
            const orderDetail = {
                orderID,
                productBarcode: product.productBarcode,
                productName: product.productName,
                price: product.price,
                quantity,
            };
            OrderDetails.add(orderDetail);
        });
        onSave(orderCode);
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
            const product = availableProducts.find((p) => p.id === productId) as Product;
            return total + (product ? product.price * quantity : 0);
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
            <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
            <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => handleRemoveProduct(item.id)} style={styles.quantityButton}>
                    <Text style={styles.increaseDecrease}>{"-"}</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>{selectedProducts[item.id] || 0}</Text>
                <TouchableOpacity onPress={() => handleAddProduct(item.id)} style={styles.quantityButton}>
                    <Text style={styles.increaseDecrease}>{"+"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCustomerItem = ({item}: { item: Customer }) => (
        <TouchableOpacity onPress={() => handleSelectCustomer(item.id)}>
            <View style={
                selectedCustomer[item.id] ? styles.customerItemSelected : styles.customerItem
            }>
                <Text style={styles.itemText}>{item.customerName}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View>
                <SearchList
                    data={availableCustomers}
                    selected={selectedCustomer}
                    elementKey="customerName"
                    placeholder={getLocalizedText('search-customers')}
                    renderItem={renderCustomerItem}
                    onRefresh={() => refreshCustomers()}
                />
                <SearchList
                    data={availableProducts}
                    selected={selectedProducts}
                    elementKey="productName"
                    placeholder={getLocalizedText('search-products')}
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
        backgroundColor: "silver",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    productItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "silver",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    itemText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        backgroundColor: "gray",
        borderRadius: 4,
        padding: 8,
        marginHorizontal: 4,
    },
    quantityText: {
        minWidth: 20,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    increaseDecrease: {
        color: "white",
        height: 20,
        width: 20,
        textAlign: "center",
    },
    total: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 24,
    },
});