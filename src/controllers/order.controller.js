const Order = require('../models/order.model');
const User = require('../models/customer.model');
const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const { getNowDate_time } = require('../helpers/utils');
const { sendHtmlEmail } = require('./sendEmail.controller');
const ejs = require('ejs');
const path = require('path');

function getFirstImage(item) {
    const images = JSON.parse(item.image);
    return images[0];
}

const createOrder = async (req, res) => {
    try {
        const orderData = await validateAndGetOrderData(req.body);
        const customer = await getOrCreateCustomer(orderData);
        const order = await createOrderAndSaveItems(orderData, customer.id);

        // send Email to customer
        const templatePath = path.resolve(`public/orderTamplate/index.html`);

        const htmlTamplate = await ejs.renderFile(templatePath, { orderData, getFirstImage });
        sendHtmlEmail(orderData.customer.email, 'hello', 'customer', htmlTamplate);

        return sendResponse(res, 201, 'Created', 'Successfully created an order.', null, order);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const validateAndGetOrderData = async (body) => {
    const {
        customer,
        products,
    } = body;

    // Validate input data

    const productIds = products.map(product => product.id);

    const data = await OrderItems.checkQuantity(productIds);

    const validationErrors = [];

    // Compare quantities
    products.forEach(product => {
        const dbProduct = data.find(p => p.id === product.id);
        if (!dbProduct) {
            validationErrors.push(`Product with ID ${product.id} not found in database.`);
        } else if (product.quantity > dbProduct.total_quantity) {
            validationErrors.push(
                `Insufficient quantity for product ID ${product.id}. Available quantity: ${dbProduct.total_quantity}`,
            );
        }
    });

    // If there are validation errors, throw an Error with all collected errors
    if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
    }

    // Get current date
    const nowDate = getNowDate_time();

    // Calculate total price before discount
    const totalPriceBeforDiscount = products.reduce((acc, current) => {
        return acc + current.price * current.quantity;
    }, 0);

    // Calculate total discount
    const totalDiscount = products.reduce((acc, current) => {
        return acc + current.discount * current.quantity;
    }, 0);

    // Calculate final price
    const finallprice = (totalPriceBeforDiscount - totalDiscount) + (customer.tax + customer.shipping);

    return {
        customer,
        products,
        nowDate,
        totalPriceBeforDiscount,
        totalDiscount,
        finallprice,
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
            registered: false,
        });

        const last_customer_id = await newCustomer.createUser();

        return { id: last_customer_id };
    }
};

const createOrderAndSaveItems = async (orderData, customerId) => {
    const {
        customer,
        products,
        nowDate,
        totalPriceBeforDiscount,
        finallprice,
        totalDiscount,
    } = orderData;

    const order = new Order({
        customer_id: customerId,
        type_id: customer.type_id,
        order_date: nowDate,
        sub_total: totalPriceBeforDiscount,
        tax: customer.tax,
        items_discount: totalDiscount,
        shipping: customer.shipping,
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
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
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
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
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
};
