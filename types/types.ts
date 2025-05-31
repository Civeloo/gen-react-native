export type Product = {
    id: string;
    productBarcode: string;
    productName: string;
    supplierID?: string;
    categoryID?: string;
    unit?: string;
    price: number;
    quantity: number;
};

export type Order = {
    id: string;
    orderCode: string;
    customerID: string;
    employeeID?: string;
    orderDate: string;
    shipperID?: string;
};

export type OrderDetail = {
    id: string;
    orderID: string;
    productID: string;
    productName: string;
    quantity: number;
    price: number;
};

export type Category = {
    id: string;
    categoryName: string;
    description: string;
};

export type Customer = {
    id: string;
    customerName: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    contact?: string;
    tin?: string;
    customerType?: string;
};

export type Company = {
    id: string;
    companyName: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    contact?: string;
    tin?: string;
    companyType?: string;
};
