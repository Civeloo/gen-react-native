import OrderDetails from "./orderDetail.model";

export const INITIAL_PRODUCTS = {
  products: {
    product0: { productName: "T-Shirt", price: 29.99 },
    product1: { productName: "Jeans", price: 70.01 },
    product2: { productName: "Sneakers", price: 89.97 },
    product3: { productName: "Hoodie", price: 49.99 },
    product4: { productName: "Socks", price: 9.99 },
    product5: { productName: "Hat", price: 24.99 },
    product6: { productName: "Jacket", price: 99.99 },
    product7: { productName: "Shorts", price: 34.99 },
  }
};

export const INITIAL_ORDERS = {
  orders: {
    order0: { customerID: "John Doe", orderDate: "2023-05-15" },
    order1: { customerID: "Jane Smith", orderDate: "2023-05-14" }
  }
};

export const INITIAL_ORDER_DETAILS = {
  orderDetails: {
    orderDetail0: { orderID: "order0", productID: "T-Shirt", price: 29.99, quantity: 2 },
    orderDetail1: { orderID: "order0", productID: "Jeans", price: 70.01, quantity: 1 },
    orderDetail2: { orderID: "order1", productID: "Sneakers", price: 189.97, quantity: 1 }
  }
};