import Customers from '@/services/database/customers.model';
import OrderDetails from '@/services/database/orderDetail.model';
import Orders from '@/services/database/orders.model';
import Products from '@/services/database/products.model';
import { getDate, getUUIDv4 } from '@/utils';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchList } from '../search-list';
import { OrderCodes } from '@/services/database/models';

type Props = {
  onSave: () => void;
};

export const AddOrder: React.FC<Props> = ({ onSave }) => {

  const availableProducts = Products.all() as Product[];
  const availableCustomers = Customers.all() as Customer[];

  const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: number }>({ customer0: 1 });
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});

  const handleSubmit = () => {
    const orderID = getUUIDv4();
    const customer = availableCustomers.find((c) => Object.keys(selectedCustomer)[0] === c.id) as Customer;
    const customerCodeKey = customer?.customerType;
    const orderCode = OrderCodes.byId(customerCodeKey);
    const orderNumber = Number(orderCode.orderNumber) + 1;
    OrderCodes.update(customerCodeKey, { orderNumber });
    const order = {
      orderCode: customerCodeKey + orderNumber.toString(),
      customerID: Object.keys(selectedCustomer)[0],
      orderDate: getDate(),
    };
    Orders.add(order, orderID);
    Object.entries(selectedProducts).forEach(([productId, quantity]) => {
      const product = availableProducts.find((p) => p.id === productId) as Product;
      const orderDetail = {
        orderID,
        productBarcode: product.productBarcode,
        productName: product.productName,
        price: product.price,
        quantity,
      };
      OrderDetails.add(orderDetail);
    });
    onSave();
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomer({ [customerId]: 1 });
  }

  const handleAddProduct = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const calculateTotal = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = availableProducts.find((p) => p.id === productId) as Product;
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev }
      if (newSelected[productId] > 1) {
        newSelected[productId]--
      } else {
        delete newSelected[productId]
      }
      return newSelected
    })
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Text>{item.productName} - ${item.price.toFixed(2)}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => handleRemoveProduct(item.id)} style={styles.quantityButton}>
          <Text>  -  </Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{selectedProducts[item.id] || 0}</Text>
        <TouchableOpacity onPress={() => handleAddProduct(item.id)} style={styles.quantityButton}>
          <Text>  +  </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity onPress={() => handleSelectCustomer(item.id)}>
      <View style={
        selectedCustomer[item.id] ? {
          backgroundColor: "silver",
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
        } : { padding: 16, marginBottom: 8 }
      }>
        <Text>{item.customerName}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* <View style={{
      flex: 1,
      justifyContent: 'space-between',
    }}> */}
      <View>
        <SearchList
          data={availableCustomers}
          selected={selectedCustomer}
          elementKey="customerName"
          placeholder="Search customers..."
          renderItem={renderCustomerItem}
        />
        <SearchList
          data={availableProducts}
          selected={selectedProducts}
          elementKey="productName"
          placeholder="Search products..."
          renderItem={renderProductItem}
        />
      </View>
      <View>
        <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
        <Button title="+" onPress={handleSubmit} />
      </View>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    padding: 16,
  },
  button: {

  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    // width: '100%',
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "silver",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
  quantityText: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
