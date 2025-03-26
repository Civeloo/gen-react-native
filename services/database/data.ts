import {getRegionCode} from "@/utils";

export const INITIAL_PRODUCTS = {
    product0: { productBarcode: '123456789012', productName: 'T-Shirt', price: 29.99, quantity: 98 },
    product1: { productBarcode: '987654321098', productName: 'Jeans', price: 70.01, quantity: 99 },
};

export const INITIAL_CUSTOMERS = {
    customer0: { customerName: 'Customer', address: '789 Oak St', city: 'Chicago', postalCode: '60001', country: 'USA', contact: '0', tin: '0' },
};

export const INITIAL_ORDER_CODES = {
    '#': { orderNumber: 0 },
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
        companyType: getRegionCode(),
    },
}