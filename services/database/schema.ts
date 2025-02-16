import { TablesSchema } from "tinybase/store";

const tablesSchema: TablesSchema = {
    // The TinyBase table contains the todos, with 'text' and 'done' cells.
    todos: {
        text: { type: 'string' },
        done: { type: 'boolean', default: false },
    },
    /* CREATE TABLE Categories
    (      
        CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
        CategoryName TEXT,
        Description TEXT
    ); */
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
        customerType: { type: 'string', default: '0' },
    },
    /* CREATE TABLE Employees
    (
        EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
        LastName TEXT,
        FirstName TEXT,
        BirthDate DATE,
        Photo TEXT,
        Notes TEXT
    ); */
    employees: {
        lastName: { type: 'string' },
        firstName: { type: 'string' },
        birthDate: { type: 'string' },
        photo: { type: 'string' },
        notes: { type: 'string' },
    },
    /* CREATE TABLE Shippers(
        ShipperID INTEGER PRIMARY KEY AUTOINCREMENT,
        ShipperName TEXT,
        Phone TEXT
    ); */
    shippers: {
        shipperName: { type: 'string' },
        phone: { type: 'string' },
    },
    /* CREATE TABLE Suppliers(
        SupplierID INTEGER PRIMARY KEY AUTOINCREMENT,
        SupplierName TEXT,
        ContactName TEXT,
        Address TEXT,
        City TEXT,
        PostalCode TEXT,
        Country TEXT,
        Phone TEXT
    ); */
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