const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const OrderItems = require('../models/orderItems.model');
const Product = require('../models/product.model');
const StoreInfo = require('../models/storeInfo.model');
const OrderType = require('../models/orderType.model');
const Payments = require('../models/payments.model');
const Shipping = require('../models/shipping.model');
const { sendResponse } = require('../helpers/apiResponse');
const { getNowDate_time, roundToTwoDecimals } = require('../helpers/utils');
const { swish_paymentrequests } = require('./swish.controller');
const { klarna_paymentrequests } = require('./klarna.controller');
const { sendOrderEmail, migrateProductsToKlarnaStructure } = require('../helpers/orderUtils');
const path = require('path');
const { sequelize } = require('../databases/mysql.db');

const PAYMNT_TYPE = {
    SWISH: 'swish',
    KLARNA: 'klarna',
    CARD: 'card',
};

const calculateVatAmount = (totalWithVat, vatRate) => {
    const res = totalWithVat * ((vatRate) / (100 + (+vatRate)));
    return roundToTwoDecimals(res);
};

const createOrderData = async (body) => {
    const { customer, products, shipping_id } = body;
    const nowDate = getNowDate_time();

    // Store tax
    const tax = await StoreInfo.getTax();

    // Shipping info
    const shipping = await Shipping.getById(shipping_id);

    const shipping_price = +shipping[0].shipping_price;
    const shipping_name = shipping[0].shipping_name;
    const shipping_time = shipping[0].shipping_time;

    // Total price before
    const totalPriceAfterDiscount = products.reduce((acc, product) => {
        const res = acc + (product.price - product.discount) * product.quantity;
        return roundToTwoDecimals(res);
    }, 0);

    const vatAmount = calculateVatAmount(totalPriceAfterDiscount, tax[0].tax_percentage);

    // Calculate total discount
    const totalDiscount = products.reduce((acc, current) => {
        const res = acc + (current.discount * current.quantity);
        return roundToTwoDecimals(res);
    }, 0);

    // Calculate final price
    const finallprice = totalPriceAfterDiscount + shipping_price;

    return {
        customer,
        products,
        nowDate,
        totalPriceAfterDiscount,
        totalDiscount,
        finallprice,
        vatAmount,
        shipping_price,
        shipping_name,
        shipping_time,
    };
};

const getOrCreateCustomer = async (customer) => {
    // Check if the user exists in the database
    const checkCustomer = await Customer.isCustomerRegistered(customer.email);

    if (checkCustomer.length) {
        // Customer exists, return the customer_id
        return checkCustomer[0].customer_id;
    } else {
        // Customer does not exist, create a new customer
        const newCustomer = new Customer(customer);
        const last_customer_id = await newCustomer.createUser();
        return last_customer_id;
    }
};

const createOrderAndSaveItems = async (orderData, customer, transaction) => {
    const {
        products,
        nowDate,
        totalPriceAfterDiscount,
        finallprice,
        totalDiscount,
        vatAmount,
        shipping_price,
        shipping_name,
        shipping_time,
    } = orderData;

    const orderType = await OrderType.getAll();
    const { customer_id, address, zip, city } = customer;

    const order = new Order({
        customer_id: customer_id,
        type_id: orderType[0].type_id,
        shipping_price: shipping_price,
        shipping_name: shipping_name,
        shipping_time: shipping_time,
        order_date: nowDate,
        address: address,
        zip: zip,
        city: city,
        sub_total: totalPriceAfterDiscount,
        tax: vatAmount,
        items_discount: totalDiscount,
        total: finallprice,
    });
    const order_id = await order.save(transaction);

    await OrderItems.saveMulti({ order_id, products }, transaction);

    return order;
};

const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { products, customer, payment } = req.body;

        // Enusre the all products are available
        const { success, message, insufficientProducts } = await Product.checkQuantities(products);
        if (!success) {
            await transaction.rollback();
            return sendResponse(res, 500, message, null, message, insufficientProducts);
        }

        // Create the order object data
        const orderData = await createOrderData(req.body);
        // Handle the customer
        const customerId = await getOrCreateCustomer(customer);
        // Create the order and the order items
        const customerToInsert = { customer_id: customerId, ...customer };
        const order = await createOrderAndSaveItems(orderData, customerToInsert, transaction);

        const response = {
            order,
        };

        if (payment) {
            if (payment.type === PAYMNT_TYPE.SWISH) {
                if (!payment.phone) {
                    return sendResponse(res, 401, 'Fail', 'No valid phone number.', null, null);
                }
                if (!payment.phone.startsWith('46')) {
                    payment.phone = '46' + payment.phone;
                }
                const amount = Number(order.total).toFixed(2);
                const payData = {
                    payerAlias: payment.phone,
                    amount: amount,
                    message: payment.message || '',
                };

                const paymentResponse = await swish_paymentrequests(payData);

                if (paymentResponse && paymentResponse?.id) {
                    await transaction.commit();
                    (new Payments({
                        payment_type_id: 2,
                        customer_id: customerId,
                        order_id: order.order_id,
                        payment_id: paymentResponse.id,
                        status: 1,
                    })).createPayment();
                }
                response.paymentResponse = paymentResponse;
            } else if (payment.type === PAYMNT_TYPE.KLARNA) {
                const klarna_order = await migrateProductsToKlarnaStructure(products, order);
                const klarna_res = await klarna_paymentrequests(klarna_order);

                if (klarna_res.session_id) {
                    await transaction.commit();
                    (new Payments({
                        payment_type_id: 3,
                        customer_id: customerId,
                        order_id: order.order_id,
                        payment_id: klarna_res.session_id,
                        status: 1,
                    })).createPayment();
                    response.klarna = klarna_res;
                }
            }
        }

        return sendResponse(res, 201, 'Created', 'Successfully created an order.', null, response);
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        sendResponse(res, 500, 'Internal Server Error', null, err?.message || err, null);
    }
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
                ok: false,
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
                ok: false,
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
                ok: false,
                statusCode: 'Bad Request',
                message: 'No order found for update',
            });
        }

        const products = await OrderItems.getItemsByOrderId(id);
        const orderDetails = await Order.getById(id);

        const orderData = { 'products': products, 'orderDetails': orderDetails[0] };
        const templatePath = path.resolve(`public/orderTamplate/shipping.html`);
        await sendOrderEmail(orderData, templatePath);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a orderType.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getOrdersByMonth = async (req, res) => {
    try {
        const { date } = req.query;
        const ordersInThisMonth = await Order.getOrdersByMonth(date);
        sendResponse(
            res,
            202,
            'Accepted',
            'Successfully retrieved all the order bymonth month ',
            null,
            ordersInThisMonth,
        );
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getOrdersTotalPriceAndCount = async (req, res) => {
    try {
        const { date } = req.query;
        const [orders] = await Order.getOrdersTotalPriceAndCount(date);
        sendResponse(
            res,
            202,
            'Accepted',
            'Successfully retrieved all the orders',
            null,
            orders,
        );
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getOrdersFilter = async (req, res) => {
    try {
        const { key, value } = req.query;
        if (!key || !value) {
            return sendResponse(res, 400, 'Bad Request', 'Please provide a key and value', null, null);
        }
        const orders = await Order.getOrderByFilter(key, value);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the orders.', null, orders);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getOrdersTotalPriceForChart = async (req, res) => {
    try {
        const { date } = req.query;
        const orders = await Order.getOrdersTotalPriceForChart(date);
        sendResponse(
            res,
            202,
            'Accepted',
            'Successfully retrieved all the orders',
            null,
            orders,
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
    getOrdersByMonth,
    getOrdersFilter,
    getOrdersTotalPriceAndCount,
    getOrdersTotalPriceForChart,
};
