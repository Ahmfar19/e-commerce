// paymentRefund.controller.js

const PaymentRefund = require('../models/paymentRefund.model');
const { sendResponse } = require('../helpers/apiResponse');

// Get all payment refunds
const getAllRefunds = async (req, res) => {
    try {
        const refunds = await PaymentRefund.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all refunds.', null, refunds);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

// Get a single refund by ID
const getRefundById = async (req, res) => {
    try {
        const id = req.params.id;
        const refund = await PaymentRefund.getById(id);
        if (!refund) {
            return sendResponse(res, 404, 'Not Found', 'Refund not found', null, null);
        }
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the refund.', null, refund);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

// Create a new refund
const createRefund = async (req, res) => {
    try {
        const { order_id, item_id, refund_id, amount } = req.body;
        const refund = new PaymentRefund({
            order_id,
            item_id,
            refund_id,
            amount,
        });

        const refundId = await refund.save();
        if (!refundId) {
            return sendResponse(res, 400, 'Bad Request', 'Unable to create refund', null, null);
        }

        sendResponse(res, 201, 'Created', 'Successfully created a refund.', null, refund);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

// Update an existing refund by ID
const updateRefund = async (req, res) => {
    try {
        const id = req.params.id;
        const refund = new PaymentRefund(req.body);
        const result = await refund.updateById(id);

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, 'Not Found', 'Refund not found for update', null, null);
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated the refund.', null, refund);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

// Delete a refund by ID
const deleteRefund = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await PaymentRefund.deleteById(id);

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, 'Not Found', 'Refund not found for deletion', null, null);
        }

        sendResponse(res, 202, 'Accepted', 'Successfully deleted the refund.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

// Sum total amount for a specific order ID
const sumRefundAmountByOrderId = async (req, res) => {
    try {
        const order_id = req.params.id;
        const totalAmount = await PaymentRefund.sumAmountByOrderId(order_id);

        sendResponse(res, 200, 'Ok', `Successfully summed the amount for order_id: ${order_id}.`, null, {
            totalAmount,
        });
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    getAllRefunds,
    getRefundById,
    createRefund,
    updateRefund,
    deleteRefund,
    sumRefundAmountByOrderId,
};
