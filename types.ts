type Product = {
    id: string;
    productBarcode: string;
    productName: string;
    supplierID?: string;
    categoryID?: string;
    unit?: string;
    price: number;
    quantity: number;
};

type Products = {
    [key: string]: Product;
};

type Order = {
    id: string;
    orderCode: string;
    customerID: string;
    employeeID?: string;
    orderDate: string;
    shipperID?: string;    
};

type OrderDetails = {
    id: string;
    orderID: string;
    productID: string;
    productName: string;
    quantity: number;
    price: number;
};

type Category = {
    id: string;
    categoryName: string;
    description: string;
};

type Customer = {
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

type Company = {
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
