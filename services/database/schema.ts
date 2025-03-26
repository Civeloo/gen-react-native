import { TablesSchema } from "tinybase/store";

const tablesSchema: TablesSchema = {
    company: {
        companyName: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'string' },
        country: { type: 'string' },
        contact: { type: 'string' },
        tin: { type: 'string' },
        companyType: { type: 'string' },
    },
    categories: {
        categoryName: { type: 'string' },
        description: { type: 'string' },
    },
    customers: {
        customerName: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'string' },
        country: { type: 'string' },
        contact: { type: 'string' },
        tin: { type: 'string' },
        customerType: { type: 'string', default: '#' },
    },
    employees: {
        lastName: { type: 'string' },
        firstName: { type: 'string' },
        birthDate: { type: 'string' },
        photo: { type: 'string' },
        notes: { type: 'string' },
    },
    shippers: {
        shipperName: { type: 'string' },
        phone: { type: 'string' },
    },
    suppliers: {
        supplierName: { type: 'string' },
        contactName: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'string' },
        country: { type: 'string' },
        phone: { type: 'string' },
    },
    products: {
        productName: { type: 'string' },
        supplierID: { type: 'string' },
        categoryID: { type: 'string' },
        unit: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'number'},
    },
    orders: {
        orderCode: { type: 'string' },
        customerID: { type: 'string' },
        employeeID: { type: 'string' },
        orderDate: { type: 'string' },
        shipperID: { type: 'string' },
        status: { type: 'string', default: 'pending' },
    },
    orderDetails: {
        orderID: { type: 'string' },
        productID: { type: 'string' },
        productName: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'number' },
    },
    orderCodes: {
        orderNumber: { type: 'number' },
    },
} as const; // NB the `as const` modifier

export { tablesSchema };