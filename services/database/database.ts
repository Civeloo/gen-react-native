import {INITIAL_CUSTOMERS, INITIAL_ORDER_CODES, INITIAL_PRODUCTS} from "./data";
import {type SQLiteDatabase} from 'expo-sqlite';

const DB_NAME = 'GeN';

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    const createTables = `
CREATE TABLE IF NOT EXISTS company (
        companyID TEXT PRIMARY KEY NOT NULL,
        companyName TEXT,
        companyContact TEXT,
        companyAddress TEXT,
        companyCity TEXT,
        companyState TEXT,
        companyPostalCode TEXT,
        companyCountry TEXT,
        companyConcept TEXT,
        companyPhone TEXT,
        companyTin TEXT,
        companyType TEXT,
        companyPOS TEXT
     );
CREATE TABLE IF NOT EXISTS categories (
        categoryID TEXT PRIMARY KEY NOT NULL,
        categoryName TEXT,
        parentCategoryID TEXT
    );
CREATE TABLE IF NOT EXISTS customers (
        customerID TEXT PRIMARY KEY NOT NULL,
        customerName TEXT,
        customerAddress TEXT,
        customerCity TEXT,
        customerPostalCode TEXT,
        customerCountry TEXT,
        customerContact TEXT,
        customerTin TEXT,
        customerType TEXT
    );
CREATE TABLE IF NOT EXISTS employees (
        employeeID TEXT PRIMARY KEY NOT NULL,
        employeeLastName TEXT,
        employeeFirstName TEXT,
        employeeBirthDate TEXT,
        employeePhoto TEXT,
        employeeNotes TEXT
    );
CREATE TABLE IF NOT EXISTS shippers (
        shipperID TEXT PRIMARY KEY NOT NULL,
        shipperName TEXT,
        shipperContact TEXT
    );
CREATE TABLE IF NOT EXISTS suppliers (
        supplierID TEXT PRIMARY KEY NOT NULL,
        supplierName TEXT,
        supplierContactName TEXT,
        supplierAddress TEXT,
        supplierCity TEXT,
        supplierPostalCode TEXT,
        supplierCountry TEXT,
        supplierPhone TEXT
    );
CREATE TABLE IF NOT EXISTS products (
        productID TEXT PRIMARY KEY NOT NULL,
        productName TEXT,
        productBarcode TEXT,
        supplierID TEXT,
        categoryID TEXT,
        productUnit TEXT,
        productPrice NUMERIC,
        productQuantity NUMERIC
    );
CREATE TABLE IF NOT EXISTS orders (
        orderID TEXT PRIMARY KEY NOT NULL,
        orderCode TEXT,
        customerID TEXT,
        employeeID TEXT,
        orderDate TEXT,
        shipperID TEXT,
        orderStatus TEXT,
        orderSignature TEXT,
        orderExpiration TEXT
    );
CREATE TABLE IF NOT EXISTS orderDetails (
        orderDetailID TEXT PRIMARY KEY NOT NULL,
        orderID TEXT,
        productID TEXT,
        orderDetailName TEXT,
        orderDetailPrice NUMERIC,
        orderDetailQuantity NUMERIC
    );
CREATE TABLE IF NOT EXISTS orderCodes (
        orderCodeID TEXT PRIMARY KEY NOT NULL,
        orderCodeNumber NUMERIC
    );`;

    const genSqlInsert = (data: { [x: string]: any; }, table: string) =>
        Object.keys(data).map(id => {
            const value = data[id] //as object;
            const fields = Object.keys(value);
            const values = fields.map(key => `"${value[key]}"`).join(',');
            return `INSERT INTO ${table}s (${table}ID,${fields})
                    VALUES ("${id}", ${values});`;
        }).join('');

    const insertProducts = genSqlInsert(INITIAL_PRODUCTS, 'product');
    const insertCustomers = genSqlInsert(INITIAL_CUSTOMERS, 'customer');
    const insertOrderCodes = genSqlInsert(INITIAL_ORDER_CODES, 'orderCode');

    if (currentDbVersion === 0) {
        const sql = `
PRAGMA journal_mode = WAL;
${createTables}
`;
        await db.execAsync(sql);
        await db.runAsync(insertProducts);
        await db.runAsync(insertCustomers);
        await db.runAsync(insertOrderCodes);
        currentDbVersion = 1;
    }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export {DB_NAME, migrateDbIfNeeded};
