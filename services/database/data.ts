import {getRegionCode} from "@/utils/utils";

export const INITIAL_PRODUCTS = {
    product0: {productBarcode: '123456789012', productName: 'Article', productPrice: 1, productQuantity: 100},
};

export const INITIAL_CUSTOMERS = {
    customer0: {
        customerName: 'Customer', customerAddress: '789 Oak St', customerCity: 'Chicago',
        customerPostalCode: '60001', customerCountry: 'USA', customerContact: '0', customerTin: '0'
    },
};

export const INITIAL_ORDER_CODES = {
    '#': {orderCodeNumber: 0},
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