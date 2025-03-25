import ExpoLocalization from "expo-localization/src/ExpoLocalization";

export const INITIAL_PRODUCTS = {
    product0: { productBarcode: '123456789012', productName: 'T-Shirt', price: 29.99, quantity: 98 },
    // product1: { productBarcode: '987654321098', productName: 'Jeans', price: 70.01, quantity: 99 },
    // product2: { productBarcode: '112233445566', productName: 'Sneakers', price: 89.97, quantity: 99 },
    // product3: { productBarcode: '665544332211', productName: 'Hoodie', price: 49.99, quantity: 100 },
    // product4: { productBarcode: '102030405060', productName: 'Socks', price: 9.99, quantity: 100 },
    // product5: { productBarcode: '605040302010', productName: 'Hat', price: 24.99, quantity: 100 },
    // product6: { productBarcode: '121212121212', productName: 'Jacket', price: 99.99, quantity: 100 },
    // product7: { productBarcode: '989898989898', productName: 'Shorts', price: 34.99, quantity: 100 },
};

export const INITIAL_CUSTOMERS = {
    customer0: { customerName: 'Customer', address: '789 Oak St', city: 'Chicago', postalCode: '60001', country: 'USA', contact: '0', tin: '0', customerCode: '0' },
    // customer1: { customerName: 'John Doe', address: '123 Main St', city: 'New York', postalCode: '10001', country: 'USA', contact: '15551234567', tin: '123456789', customerCode: 'A' },
    // customer2: { customerName: 'Jane Smith', address: '456 Elm St', city: 'Los Angeles', postalCode: '90001', country: 'USA', contact: '15552345678', tin: '223456789', customerCode: 'B' },
};

export const INITIAL_ORDERS = {
    // order0: { orderCode: 'A1', customerID: 'customer1', orderDate: '2023-05-15' },
    // order1: { orderCode: 'B1', customerID: 'customer2', orderDate: '2023-05-14' },
    // order2: { orderCode: 'C1', customerID: 'customer0', orderDate: '2023-05-13', status:'cancelled' },
};

export const INITIAL_ORDER_DETAILS = {
    // orderDetail0: { orderID: 'order0', productID: 'product0', productName: 'T-Shirt', price: 29.99, quantity: 2 },
    // orderDetail1: { orderID: 'order0', productID: 'product1', productName: 'Jeans', price: 70.01, quantity: 1 },
    // orderDetail2: { orderID: 'order1', productID: 'product2', productName: 'Sneakers', price: 189.97, quantity: 1 },
    // orderDetail3: { orderID: 'order2', productID: 'product3', productName: 'Hoodie', price: 49.99, quantity: 3 },
};

export const INITIAL_ORDER_CODES = {
    '0': { orderNumber: 0 },
    // 'A': { orderNumber: 1 },
    // 'B': { orderNumber: 1 },
    // 'C': { orderNumber: 0 },
};

export const INITIAL_COMPANY = {
    company0: {
        companyName: 'Company Name',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        contact: '',
        tin: '',
        companyType: ExpoLocalization.getLocales()[0]?.regionCode || ['US'],
    },
}