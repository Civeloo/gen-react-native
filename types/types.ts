export type Company = {
    companyID: string;
    companyName: string;
    companyContact: string;
    companyAddress: string;
    companyCity: string;
    companyState: string;
    companyPostalCode: string;
    companyCountry: string;
    companyConcept: string;
    companyPhone: string;
    companyTin: string;
    companyType: string;
    companyPtoVta: string;
};

export type Category = {
    categoryID: string;
    categoryName: string;
    parentCategoryID: string;
};

export type Customer = {
    customerID: string;
    customerName: string;
    customerAddress?: string;
    customerCity?: string;
    customerPostalCode?: string;
    customerCountry?: string;
    customerContact: string;
    customerTin: string;
    customerType: string;
};

export type Employee = {
    employeeID: string;
    employeeLastName: string;
    employeeFirstName: string;
    employeeBirthDate: string;
    employeePhoto: string;
    employeeNotes: string;
};

export type Shipper = {
    shipperID: string;
    shipperName: string;
    shipperContact: string;
};

export type Supplier = {
    supplierID: string;
    supplierName: string;
    supplierContactName: string;
    supplierAddress: string;
    supplierCity: string;
    supplierPostalCode: string;
    supplierCountry: string;
    supplierPhone: string;
}

export type Product = {
    productID: string;
    productName: string;
    productBarcode?: string;
    supplierID?: string;
    categoryID?: string;
    productUnit?: string;
    productPrice: number;
    productQuantity: number;
};

export type Order = {
    orderID: string;
    orderCode: string;
    customerID: string;
    employeeID?: string;
    orderDate: string;
    shipperID?: string;
    orderStatus: string;
    orderSignature?: string;
    orderExpiration?: string;
};

export type OrderDetail = {
    orderDetailID: string;
    orderID: string;
    productID: string;
    orderDetailName: string;
    orderDetailPrice: number;
    orderDetailQuantity: number;
};

export type OrderCode = {
    orderCodeID: string;
    orderCodeNumber: number;
};

export type Invoice = {
    order: Order;
    orderDetails: OrderDetail[];
    customer: Customer;
    company: Company;
    total: number;
};