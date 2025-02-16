export const INITIAL_PRODUCTS = {
    product0: { productBarcode: '123456789012', productName: "T-Shirt", price: 29.99 },
    product1: { productBarcode: '987654321098', productName: "Jeans", price: 70.01 },
    product2: { productBarcode: '112233445566', productName: "Sneakers", price: 89.97 },
    product3: { productBarcode: '665544332211', productName: "Hoodie", price: 49.99 },
    product4: { productBarcode: '102030405060', productName: "Socks", price: 9.99 },
    product5: { productBarcode: '605040302010', productName: "Hat", price: 24.99 },
    product6: { productBarcode: '121212121212', productName: "Jacket", price: 99.99 },
    product7: { productBarcode: '989898989898', productName: "Shorts", price: 34.99 },
};

export const INITIAL_CUSTOMERS = {
    customer0: { customerName: "Customer", address: "789 Oak St", city: "Chicago", postalCode: '60001', country: "USA", contact: "323-456-7890", tin: '323456789', customerCode: 'C' },
    customer1: { customerName: "John Doe", address: "123 Main St", city: "New York", postalCode: '10001', country: "USA", contact: "123-456-7890", tin: '123456789', customerCode: 'A' },
    customer2: { customerName: "Jane Smith", address: "456 Elm St", city: "Los Angeles", postalCode: '90001', country: "USA", contact: "223-456-7890", tin: '223456789', customerCode: 'B' },
};

export const INITIAL_ORDERS = {
    order0: { orderCode: 'A1', customerID: 'customer1', orderDate: '2023-05-15' },
    order1: { orderCode: 'B1', customerID: 'customer2', orderDate: '2023-05-14' },
    order2: { orderCode: 'C1', customerID: 'customer0', orderDate: '2023-05-13', status:'cancelled' },
};

export const INITIAL_ORDER_DETAILS = {
    orderDetail0: { orderID: 'order0', productBarcode: '123456789012', productName: "T-Shirt", price: 29.99, quantity: 2 },
    orderDetail1: { orderID: 'order0', productBarcode: '987654321098', productName: "Jeans", price: 70.01, quantity: 1 },
    orderDetail2: { orderID: 'order1', productBarcode: '112233445566', productName: "Sneakers", price: 189.97, quantity: 1 },
    orderDetail3: { orderID: 'order2', productBarcode: '665544332211', productName: "Hoodie", price: 49.99, quantity: 3 },
};

export const INITIAL_ORDER_CODES = {
    '0': { orderNumber: 0 },
    'A': { orderNumber: 1 },
    'B': { orderNumber: 1 },
    'C': { orderNumber: 0 },
};