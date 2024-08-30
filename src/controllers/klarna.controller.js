const klarnaModel = require('../models/klarna.model.js');
const { unmigrateKlarnaStruct } = require('../helpers/orderUtils.js');
const { createOrderFromKlarnaStruct } = require('./order.controller.js');
const Payments = require('../models/payments.model');
const orderModel = require('../models/order.model.js');
const { sendResponse } = require('../helpers/apiResponse');

// Read here for more information
// https://docs.klarna.com/klarna-checkout/additional-resources/confirm-purchase/

const ORDER_STATUS = {
    AUTHORIZED: 'AUTHORIZED',
    PAID: 'PAID',
};

const klarna_paymentrequests = async (orderData) => {
    try {
        const session = await klarnaModel.createKlarnaSession(orderData);
        return {
            success: true,
            session_id: session.order_id,
            html_snippet: session.html_snippet,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create Klarna payment request',
            error: error.message,
        };
    }
};

// Get order status from Klarna order management
const getOrder = async (req, res) => {
    const { klarna_order_id } = req.query;

    if (!klarna_order_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing Klarna order ID',
        });
    }

    try {
        const order = await klarnaModel.getOrder(klarna_order_id);
        return res.status(200).json({
            success: true,
            order: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve Klarna order status',
            error: error.message,
        });
    }
};

const getOrderStatus = async (req, res) => {
    const { klarna_order_id } = req.query;
    try {
        const order = await klarnaModel.getOrderStatus(klarna_order_id);
        return res.status(200).json({
            success: true,
            status: order.status,
            payment_status: order.payment_status,
            session_id: order.order_id,
            order: order, // TODO:_Remove
        });
    } catch (error) {
        return sendResponse(res, 400, 'Klarna order status is not authorized', 'NOT FOUND', null, null);
    }
};

const cancelKlarnaOrder = async (req, res) => {
    const { klarna_order_id } = req.body;
    try {
        const success = await klarnaModel.cancelKlarnaOrder(klarna_order_id);
        if (success) {
            return res.status(200).json({
                success: true,
                message: 'Klarna order successfully canceled',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to cancel Klarna order',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel Klarna order',
            error: error.message,
        });
    }
};

const acknowledgeKlarnaCheckoutOrder = async (req, res) => {
    const { klarna_order_id } = req.body;
    try {
        const success = await klarnaModel.acknowledgeKlarnaOrder(klarna_order_id);
        if (success) {
            return res.status(200).json({
                success: true,
                message: 'Klarna order successfully acknowledged',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to acknowledge Klarna order',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to acknowledge Klarna order',
            error: error.message,
        });
    }
};

const receivePush = async (req, res) => {
    const { klarna_order_id } = req.query;
    try {
        if (!klarna_order_id) {
            throw new Error('Missing Klarna order ID');
        }

        const response = await orderModel.isOrderCommited(klarna_order_id);
        let order_id = response.order_id;
        if (!response.ok) {
            // Klarna order not found - i should create it here
            const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
            const orderData = unmigrateKlarnaStruct(klarnaOrder);
            order_id = await createOrderFromKlarnaStruct(orderData);
        }

        const result = await klarnaModel.completeOrderValidation(klarna_order_id, order_id);

        if (result.success) {
            return res.status(200).json(result);
        }

        return res.status(500).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to report Klarna order status',
            error: error.message,
        });
    }
};

const createOrder = async (req, res) => {
    const { klarna_order_id } = req.body;

    const existingPayment = await Payments.getPaymentsByPaymentId(klarna_order_id);

    if (existingPayment.length > 0) {
        return sendResponse(res, 200, 'Order already created', 'CREATED', null, null);
    }

    try {
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
        if (klarnaOrder.status !== ORDER_STATUS.AUTHORIZED) {
            return sendResponse(res, 400, 'Klarna order status is not authorized', null, null, null);
        }

        const orderData = unmigrateKlarnaStruct(klarnaOrder);
        const order_id = await createOrderFromKlarnaStruct(orderData);

        if (!order_id) {
            throw new Error('Failed to create order');
        }

        // 1.There should be an attempt to acknowledge the order on the confirmation page.
        const error = await klarnaModel.validateOrderDetails(klarnaOrder, order_id);

        if (error) {
            throw new Error('Failed to validate order details - ' + error);
        }

        const accRes = klarnaModel.acknowledgeKlarnaOrder(klarna_order_id);
        if (!accRes) {
            throw new Error('Failed to acknowledge Klarna order');
        }

        // 2. If the order is acknowledged, the order status should be updated to CONFIRMED.

        return sendResponse(res, 200, 'Order created successfully', null, null, null);
    } catch (error) {
        return sendResponse(res, 500, 'Failed to create order from Klarna structure', null, error.message, null);
    }
};

const captureOrder = async (req, res) => {
    const { klarna_order_id } = req.body;

    try {
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
        if (klarnaOrder.status !== ORDER_STATUS.AUTHORIZED) {
            return sendResponse(res, 400, 'Klarna order status is not authorized for capture', null, null, null);
        }

        // Prepare capture details
        const captureDetails = {
            captured_amount: klarnaOrder.order_amount,
            order_lines: klarnaOrder.order_lines,
            description: 'Capturing payment for order ' + klarna_order_id,
        };

        // Capture the order
        const captureResult = await klarnaModel.captureKlarnaOrder(klarna_order_id, captureDetails);

        if (!captureResult.success) {
            throw new Error(captureResult.message || 'Failed to capture Klarna order');
        }

        // Update payment status to CAPTURED
        await Payments.updatePaymentStatus(klarna_order_id, 5);

        return sendResponse(res, 200, 'Order captured successfully', null, captureResult.data, null);
    } catch (error) {
        return sendResponse(res, 500, 'Failed to capture order', null, error.message, null);
    }
};

const getOrderCaptures = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Fetch captures for the given order ID
        const result = await klarnaModel.fetchOrderCaptures(orderId);

        if (result.success) {
            return res.status(200).json({
                message: 'Order captures fetched successfully',
                data: result.data,
            });
        } else {
            return res.status(500).json({
                message: 'Failed to fetch order captures',
                error: result.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching order captures',
            error: error.message,
        });
    }
};

const refundOrder = async (req, res) => {
    const { orderId } = req.params; // Assuming the orderId is passed as a URL parameter
    // const { refundDetails } = req.body;
    try {
        const klarnaOrder = await klarnaModel.getOrder(orderId);

        // Prepare capture details
        const refundDetails = {
            refunded_amount: klarnaOrder.order_amount,
            order_lines: klarnaOrder.order_lines,
            description: 'Refund for returned items for order ' + orderId,
        };

        if (klarnaOrder.refunded_amount === refundDetails.refunded_amount) {
            return sendResponse(res, 400, 'The refund is already done with the refund amount', null, null, null);
        }

        // Process the refund for the given order ID
        const result = await klarnaModel.refundKlarnaOrder(orderId, refundDetails);

        if (result.success) {
            await Payments.updatePaymentStatus(orderId, 6);
            return sendResponse(res, 200, 'Order refunded successfully', null, result.data, null);
        } else {
            return sendResponse(res, 500, 'Failed to refund Klarna order', null, result.message, null);
        }
    } catch (error) {
        return sendResponse(res, 500, 'An error occurred while refunding the order', null, error.message, null);
    }
};

module.exports = {
    createOrder,
    klarna_paymentrequests,
    cancelKlarnaOrder,
    getOrder,
    getOrderStatus,
    receivePush,
    acknowledgeKlarnaCheckoutOrder,
    captureOrder,
    getOrderCaptures,
    refundOrder,
};
