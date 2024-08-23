const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const OrderItems = require('../models/orderItems.model');
const Product = require('../models/product.model');
const StoreInfo = require('../models/storeInfo.model');
const OrderType = require('../models/orderType.model');
const Payments = require('../models/payments.model');
const Shipping = require('../models/shipping.model');
const { sendResponse } = require('../helpers/apiResponse');
const { roundToTwoDecimals, normalizePhoneNumber } = require('../helpers/utils');
const { swish_paymentrequests } = require('./swish.controller');
const { klarna_paymentrequests } = require('./klarna.controller');
const { sendOrderEmail, migrateProductsToKlarnaStructure, commitOrder } = require('../helpers/orderUtils');
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
    try {
        const { customer, products, shipping_id } = body;

        // Input validation
        if (!customer || !Array.isArray(products) || !shipping_id) {
            throw new Error('Invalid input: customer, products array, and shipping_id are required');
        }

        // Store tax
        const tax = await StoreInfo.getTax();
        if (!tax || tax.length === 0) {
            throw new Error('Tax information not found');
        }

        // Shipping info
        const shipping = await Shipping.getById(shipping_id);
        if (!shipping || shipping.length === 0) {
            throw new Error('Shipping information not found');
        }

        const shipping_price = +shipping[0].shipping_price || 0;
        const shipping_name = shipping[0].shipping_name || '';
        const shipping_time = shipping[0].shipping_time || '';

        // Total price calculation
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
            totalPriceAfterDiscount,
            totalDiscount,
            finallprice,
            vatAmount,
            shipping_price,
            shipping_name,
            shipping_time,
            shipping_id,
        };
    } catch (error) {
        return null;
    }
};

const getOrCreateCustomer = async (customer) => {
    try {
        const checkCustomer = await Customer.isCustomerRegistered(customer.email);

        if (checkCustomer.length) {
            return checkCustomer[0].customer_id;
        } else {
            const newCustomer = new Customer(customer);
            const last_customer_id = await newCustomer.createUser();
            return last_customer_id;
        }
    } catch (error) {
        return null;
    }
};

const createOrderAndSaveItems = async (orderData, customer, transaction) => {
    try {
        const {
            products,
            totalPriceAfterDiscount,
            finallprice,
            totalDiscount,
            vatAmount,
            shipping_price,
            shipping_name,
            shipping_time,
        } = orderData;

        const orderType = await OrderType.getAll();
        if (!orderType || orderType.length === 0) {
            throw new Error('Order type not found');
        }

        const { customer_id, address, zip, city } = customer;
        if (!customer_id || !address || !zip || !city) {
            throw new Error('Invalid customer data');
        }

        // Create new order
        const order = new Order({
            customer_id,
            type_id: orderType[0].type_id,
            shipping_price,
            shipping_name,
            shipping_time,
            address,
            zip,
            city,
            sub_total: totalPriceAfterDiscount,
            tax: vatAmount,
            items_discount: totalDiscount,
            total: finallprice,
        });

        if (!transaction) {
            return { ...order, ...customer };
        } else {
            // Save order and items
            const order_id = await order.save(transaction);
            await OrderItems.saveMulti({ order_id, products }, transaction);
        }

        return { ...order, ...customer };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        throw error;
    }
};

const createPaymentRecord = async (typeId, customerId, orderId, paymentId, status, transaction = null) => {
    await (new Payments({
        payment_type_id: typeId,
        customer_id: customerId,
        order_id: orderId,
        payment_id: paymentId,
        status: status,
    })).createPayment(transaction);
};

const handleSwishPayment = async (payment, order, customerId, transaction) => {
    if (!payment.phone) {
        return { error: true, statusCode: 401, message: 'No valid phone number.' };
    }

    payment.phone = normalizePhoneNumber(payment.phone);
    const payData = {
        payerAlias: payment.phone,
        amount: Number(order.total).toFixed(2),
        message: payment.message || '',
    };

    const paymentResponse = await swish_paymentrequests(payData);

    if (paymentResponse && paymentResponse.id) {
        await createPaymentRecord(2, customerId, order.order_id, paymentResponse.id, 1, transaction);
        return { data: { paymentResponse, commit: true } };
    }

    return { error: true, statusCode: 400, message: 'Swish payment failed' };
};

const handleKlarnaPayment = async (payment, order, customerId, transaction, products) => {
    if (payment.paymentstatus === 'PAID') {
        const existingPayment = await Payments.getPaymentsByPaymentId(payment.payment_id);
        if (existingPayment.length > 0) {
            return { error: true, statusCode: 400, message: 'Order already created.' };
        }

        await createPaymentRecord(3, customerId, order.order_id, payment.payment_id, 2, transaction);
        return { data: { commit: true } };
    } else {
        const klarnaOrder = await migrateProductsToKlarnaStructure(products, order);
        const klarnaRes = await klarna_paymentrequests(klarnaOrder);
        if (klarnaRes.session_id) {
            return { data: { ...klarnaRes, commit: false } };
        }
        return { error: true, statusCode: 400, message: 'Klarna payment failed' };
    }
};

const handlePayment = async (payment, order, customerId, transaction, products) => {
    if (!payment) return { data: {} };

    switch (payment.type) {
        case PAYMNT_TYPE.SWISH:
            return await handleSwishPayment(payment, order, customerId, transaction);
        case PAYMNT_TYPE.KLARNA:
            return await handleKlarnaPayment(payment, order, customerId, transaction, products);
        default:
            return { error: true, statusCode: 400, message: 'Invalid payment type' };
    }
};

const createOrder = async (req, res) => {
    let transaction = null;
    try {
        const { products, customer, payment } = req.body;

        // Enusre the all products are available
        const { success, message, insufficientProducts } = await Product.checkQuantities(products);
        if (!success) {
            return sendResponse(res, 500, message, null, message, insufficientProducts);
        }

        // Create the order object data
        const orderData = await createOrderData(req.body);
        if (!orderData) {
            return sendResponse(res, 400, 'Failed to create order data', null, null);
        }

        // Handle the customer
        const customerId = await getOrCreateCustomer(customer);
        if (!customerId) {
            return sendResponse(res, 400, 'Failed to get or create customer', null, null);
        }

        // Create the order and the order items
        const customerToInsert = { customer_id: customerId, ...customer };

        if (payment?.paymentstatus !== 'CREATED') {
            transaction = await sequelize.transaction();
        }

        const order = await createOrderAndSaveItems(orderData, customerToInsert, transaction);
        order.shipping_id = orderData.shipping_id;

        // Handle payment
        const paymentResponse = await handlePayment(payment, order, customerId, transaction, products);
        if (paymentResponse.error) {
            await transaction?.rollback();
            return sendResponse(res, paymentResponse.statusCode, paymentResponse.message);
        }

        if (paymentResponse.data.commit) {
            await transaction?.commit();
            // The klarna order is inserted here to we need to
            // commit the order here when the order is done
            if (payment.type === PAYMNT_TYPE.KLARNA) {
                await commitOrder(order.order_id);
            }
        }

        return sendResponse(res, 201, 'Created', 'Successfully created an order.', null, {
            order,
            ...paymentResponse.data,
        });
    } catch (err) {
        await transaction?.rollback();
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
        const { trackingNumber } = req.body;

        const updateResult = await Order.updateOrderType(id, trackingNumber);
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                ok: false,
                statusCode: 'Not Found',
                message: 'No order found for update',
            });
        }

        const [products, orderDetails] = await Promise.all([
            OrderItems.getItemsByOrderId(id),
            Order.getById(id),
        ]);

        if (!orderDetails.length) {
            return res.status(404).json({
                ok: false,
                statusCode: 'Not Found',
                message: 'Order details not found',
            });
        }

        const shipping_url = await Shipping.getByName(orderDetails[0].shipping_name);

        const orderData = {
            products,
            shipping_url: shipping_url?.shipping_url || null,
            ...orderDetails[0],
        };

        const templatePath = path.resolve(`public/orderTamplate/shipping.html`);
        await sendOrderEmail(orderData, templatePath);

        sendResponse(res, 202, 'Accepted', 'Successfully updated the order type.', null, null);
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

const resendEmail = async (req, res) => {
    try {
        const { id, isResend } = req.body;
        await commitOrder(id, isResend);
        sendResponse(res, 200, 'Ok', 'Successfully resend Email', null, null);
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
    resendEmail,
};
