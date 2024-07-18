const Order = require('../models/order.model');
const User = require('../models/customer.model');
const OrderItems = require('../models/orderItems.model');
const StoreInfo = require('../models/storeInfo.model');
const OrderType = require('../models/orderType.model');
const Shipping = require('../models/shipping.model');
const { sendResponse } = require('../helpers/apiResponse');
const { getNowDate_time } = require('../helpers/utils');
const { sendHtmlEmail, sendReqularEmail } = require('./sendEmail.controller');
const ejs = require('ejs');
const path = require('path');
const mailMessags = require('../helpers/emailMessages');
const fs = require('fs');

function getFirstImage(item) {
    const images = JSON.parse(item.image);
    return images[0];
}

const calculateVatAmount = (totalWithVat, vatRate) => {
    return totalWithVat * ((vatRate) / (100 + (+vatRate)));
};

const createOrder = async (req, res) => {
    try {
        const orderData = await validateAndGetOrderData(req.body);
        const customer = await getOrCreateCustomer(orderData);
        const order = await createOrderAndSaveItems(orderData, customer.id);
        const products = orderData.products;

        // Construct inline images data
        const inlineImages = products.map((product) => {
            const firstImage = JSON.parse(product.image)[0];
            const imagePath = path.resolve(
                __dirname,
                '../../public/images',
                `product_${product.product_id}`,
                firstImage,
            );
            console.log('Constructed image path:', imagePath);

            return {
                filename: firstImage,
                path: imagePath,
                cid: `${firstImage}`, // Unique CID
            };
        });

        orderData.products.forEach(product => {
            product.cid = getFirstImage(product);
        });

        // Get the store information to add to the email
        const [storeInfo] = await StoreInfo.getAll();
        orderData.storeInfo = storeInfo;

        // send Email to customer
        const templatePath = path.resolve(`public/orderTamplate/index.html`);
        const htmlTamplate = await ejs.renderFile(templatePath, { orderData, getFirstImage });
        sendHtmlEmail(orderData.customer.email, 'hello', 'customer', htmlTamplate, inlineImages);
        return sendResponse(res, 201, 'Created', 'Successfully created an order.', null, order);
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, 'Internal Server Error', null, err?.message || err, null);
    }
};

const validateAndGetOrderData = async (body) => {
    const {
        customer,
        products,
        shipping_id,
    } = body;

    const productIds = products.map(product => product.product_id);

    const data = await OrderItems.checkQuantity(productIds);

    const validationErrors = [];

    // Compare quantities
    products.forEach(product => {
        const dbProduct = data.find(p => p.product_id === product.product_id);
        if (!dbProduct) {
            validationErrors.push(`Product with ID ${product.product_id} not found in database.`);
        } else if (product.quantity > dbProduct.quantity) {
            validationErrors.push(
                `Insufficient quantity for product ID ${product.product_id}. Available quantity: ${dbProduct.quantity}`,
            );
        }
    });

    // If there are validation errors, throw an Error with all collected errors
    if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
    }

    // Get current date
    const nowDate = getNowDate_time();

    // Calculate total price before discount (total price with tax)
    const totalPriceBeforDiscount = products.reduce((acc, current) => {
        return acc + current.price * current.quantity;
    }, 0);

    // clacuture vat amount
    const tax = await StoreInfo.getTax();

    // shipping
    const shipping = await Shipping.getById(shipping_id);

    const shipping_price = shipping[0].shipping_price;

    const vatAmount = calculateVatAmount(totalPriceBeforDiscount, tax[0].tax_percentage);

    // Calculate total discount
    const totalDiscount = products.reduce((acc, current) => {
        return acc + current.discount * current.quantity;
    }, 0);

    // Calculate final price
    const finallprice = (totalPriceBeforDiscount - totalDiscount) + (+shipping_price);

    return {
        customer,
        products,
        nowDate,
        totalPriceBeforDiscount,
        totalDiscount,
        finallprice,
        vatAmount,
        shipping_price,
        shipping_id,
    };
};

const getOrCreateCustomer = async (orderData) => {
    const { customer } = orderData;

    // Check if the user exists in the database
    const checkCustomer = await Order.checkCustomerIfExisted(customer.email);

    if (checkCustomer.length) {
        // User exists, return their customer_id
        return { id: checkCustomer[0].customer_id };
    } else {
        // User does not exist, create a new customer
        const newCustomer = new User({
            fname: customer.fname,
            lname: customer.lname,
            email: customer.email,
            address: customer.address,
            phone: customer.phone,
            zip: customer.zip,
            city: customer.city,
            registered: false,
        });

        const last_customer_id = await newCustomer.createUser();

        return { id: last_customer_id };
    }
};

const createOrderAndSaveItems = async (orderData, customerId) => {
    const {
        products,
        nowDate,
        totalPriceBeforDiscount,
        finallprice,
        totalDiscount,
        vatAmount,
        shipping_id,
    } = orderData;

    const orderType = await OrderType.getAll();

    const order = new Order({
        customer_id: customerId,
        type_id: orderType[0].type_id,
        shipping_id: shipping_id,
        order_date: nowDate,
        sub_total: totalPriceBeforDiscount,
        tax: vatAmount,
        items_discount: totalDiscount,
        total: finallprice,
    });

    const order_id = await order.save();

    await OrderItems.saveMulti({
        order_id,
        products,
    });

    await Order.updateProductQuantities(products);
    return order;
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the orders.', null, orders);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const deleteAllOrders = async (req, res) => {
    try {
        await Order.deleteAll();
        sendResponse(res, 202, 'Accepted', 'Successfully deleted all orders', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getOrderByCustomerId = async (req, res) => {
    try {
        const id = req.params.id;
        const customerOrders = await Order.getByCustomerId(id);

        sendResponse(res, 202, 'Accepted', 'Successfully retrieved all the orders for customer.', null, customerOrders);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteOrderByCustomerId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Order.deleteOrderByCustomerId(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No orders found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a customer orders.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Order.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No order found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted  order.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.getById(id);
        sendResponse(res, 202, 'Accepted', 'Successfully retrieved all the order ', null, order);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getOrderByType = async (req, res) => {
    try {
        const orderByType = await Order.getByType();
        sendResponse(res, 202, 'Accepted', 'Successfully retrieved all the order ', null, orderByType);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updateOrderType = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Order.updateOrderType(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No order found for update',
            });
        }

        const CustomerInformation = await Order.getUserFromOrderId(id);
        const title = mailMessags.shippingOrder.title.replace('{0}', CustomerInformation[0].customerName);
        const body = mailMessags.shippingOrder.body;
        sendReqularEmail(CustomerInformation[0].email, title, body);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a orderType.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getOrdersInThisMonth = async (req, res) => {
    try {
        const ordersInThisMonth = await Order.getFilterByYearMonth();
        sendResponse(
            res,
            202,
            'Accepted',
            'Successfully retrieved all the order in this month ',
            null,
            ordersInThisMonth,
        );
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    deleteAllOrders,
    getOrderByCustomerId,
    deleteOrderByCustomerId,
    deleteOrderById,
    getOrderById,
    getOrderByType,
    updateOrderType,
    getOrdersInThisMonth,
};
