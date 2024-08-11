const Payments = require('../models/payments.model');
const { sendResponse } = require('../helpers/apiResponse');
const Joi = require('joi');

const statusSchema = Joi.string().valid('pending', 'completed', 'failed').required().messages({
    'string.base': 'Payment status must be a string',
    'any.required': 'Payment status is required',
});

const createPayment = async (req, res) => {
    try {
        const { payments_type_id, customer_id, order_id, payment_id, status } = req.body;

        const { error } = statusSchema.validate(status);
        if (error) {
            return res.status(400).json({
                error: `${error.details[0].message}`,
                ok: false,
            });
        }

        const payment = new Payments({
            payments_type_id,
            customer_id,
            order_id,
            payment_id,
            status,
        });

        await payment.createPayments();

        return sendResponse(res, 201, 'Created', 'Successfully created a payment.', null, payment);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payments.getAllPaymentss();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all payments.', null, payments);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getPaymentById = async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await Payments.getPaymentsById(id);
        if (!payment.length) {
            return sendResponse(res, 404, 'Not Found', 'Payment not found', null, null);
        }
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the payment.', null, payment);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updatePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const { payments_type_id, customer_id, order_id, payment_id, status } = req.body;

        const payment = new Payments({
            payments_type_id,
            customer_id,
            order_id,
            payment_id,
            status,
        });

        await payment.updatePayments(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the payment.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        await Payments.deletePayments(id);
        sendResponse(res, 202, 'Accepted', 'Successfully deleted the payment.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getPaymentsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const payments = await Payments.getPaymentssByStatus(status);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved payments by status.', null, payments);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getPaymentsByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;

        const payments = await Payments.getPaymentssByCustomerId(customerId);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved payments by customer ID.', null, payments);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const { error } = statusSchema.validate(status);
        if (error) {
            return res.status(400).json({
                error: `${error.details[0].message}`,
                ok: false,
            });
        }

        await Payments.updatePaymentsStatus(id, status);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the payment status.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentsByStatus,
    getPaymentsByCustomerId,
    updatePaymentStatus,
};
