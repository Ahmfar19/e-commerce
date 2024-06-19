const Order = require('../models/order.model');
const User = require('../models/customer.model');
const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const { hashPassword } = require('../helpers/utils');
const { getNowDate_time } = require('../helpers/utils')
const { sendReqularEmail } = require('./sendEmail.controller');
const path = require('path');
const fs = require('fs');
const createOrder = async (req, res) => {
    try {
        const orderData = await validateAndGetOrderData(req.body);
        const customer = await getOrCreateCustomer(orderData);
        const order = await createOrderAndSaveItems(orderData, customer.id);
        const htmlTemplatePath = path.resolve(`assets/orderTamplate/index.html`);
        let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');
        sendReqularEmail(orderData.email, "hello", "customer", htmlTemplate)
        return sendResponse(res, 201, 'Created', 'Successfully created an order.', null, order);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const validateAndGetOrderData = async (body) => {
    const {
        username, first_name, last_name,
        email, password, address,
        phone, personal_number, registered,
        type_id,
        tax, shipping, orderItems
    } = body;

    // Validate input data
    if (!username || !email || !password || !address || !phone || !personal_number || !registered || !type_id || !tax || !shipping || !orderItems) {
        throw new Error('Invalid input data.');
    }

    // Get current date
    const nowDate = getNowDate_time();

    // Calculate total price before discount
    const totalPriceBeforDiscount = orderItems.reduce((acc, current) => {
        return acc + current.price * current.quantity;
    }, 0);

    // Calculate total discount
    const totalDiscount = orderItems.reduce((acc, current) => {
        return acc + current.discount * current.quantity;
    }, 0);

    // Calculate final price
    const finallprice = (totalPriceBeforDiscount - totalDiscount) + (tax + shipping);

    return {
        username,
        first_name,
        last_name,
        email,
        password,
        address,
        phone,
        personal_number,
        registered,
        type_id,
        tax,
        shipping,
        orderItems,
        nowDate,
        totalPriceBeforDiscount,
        totalDiscount,
        finallprice
    };
};

const getOrCreateCustomer = async (orderData) => {
    const { email, password } = orderData;

    // Check if the user exists in the database
    const checkCustomer = await Order.checkCustomerIfExisted(email);

    if (checkCustomer.length) {
        // User exists, return their customer_id
        return { id: checkCustomer[0].customer_id };
    } else {
        // User does not exist, create a new customer
        const hashedPassword = await hashPassword(password);

        if (!hashedPassword.success) {
            throw new Error(hashedPassword.error);
        }

        const customer = new User({
            username: orderData.username,
            first_name: orderData.first_name,
            last_name: orderData.last_name,
            email,
            password: hashedPassword.data,
            address: orderData.address,
            phone: orderData.phone,
            personal_number: orderData.personal_number,
            registered: orderData.registered
        });

        const last_customer_id = await customer.createUser();
        return { id: last_customer_id };
    }
};

const createOrderAndSaveItems = async (orderData, customerId) => {
    const {
        type_id,
        nowDate,
        totalPriceBeforDiscount,
        tax,
        totalDiscount,
        shipping,
        finallprice,
        orderItems
    } = orderData;

    const order = new Order({
        customer_id: customerId,
        type_id,
        order_date: nowDate,
        sub_total: totalPriceBeforDiscount,
        tax,
        items_discount: totalDiscount,
        shipping,
        total: finallprice
    });

    const order_id = await order.save();
    await OrderItems.saveMulti({
        order_id,
        orderItems
    });

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
        const { id } = req.params
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
