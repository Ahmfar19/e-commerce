/* eslint-disable no-unused-vars */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendResponse } = require('../helpers/apiResponse');
const Payments = require('../models/payments.model');
const { commitOrder } = require('../helpers/orderUtils');
const { deleteById } = require('../models/order.model');

const PAYMENT_STATUS = {
    CREATED: 'CREATED',
    PAID: 'PAID',
    DECLINED: 'DECLINED',
    PENDING: 'PENDING',
};

const testConfig = {
    payeeAlias: '1231181189',
    host: 'https://mss.cpc.getswish.net/swish-cpcapi',
    qrHost: 'https://mpc.getswish.net/qrg-swish',
    cert: path.resolve(__dirname, '../ssl/swish/Swish_Merchant_TestCertificate_1234679304.pem'),
    key: path.resolve(__dirname, '../ssl/swish/Swish_Merchant_TestCertificate_1234679304.key'),
    ca: path.resolve(__dirname, '../ssl/swish/Swish_TLS_RootCA.pem'),
    passphrase: 'swish',
};

const prodConfig = {
    payeeAlias: 'YOUR_PAYEE_ALIAS',
    host: 'https://cpc.getswish.net/swish-cpcapi',
    qrHost: 'https://mpc.getswish.net/qrg-swish',
    cert: path.resolve(__dirname, 'ssl/prod.pem'),
    key: path.resolve(__dirname, 'ssl/prod.key'),
    passphrase: null,
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : testConfig;

const axiosInstance = axios.create({
    baseURL: config.host,
    httpsAgent: new require('https').Agent({
        cert: fs.readFileSync(config.cert),
        key: fs.readFileSync(config.key),
        ca: config.ca ? fs.readFileSync(config.ca) : undefined,
        passphrase: config.passphrase,
    }),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create Payment Request
async function swish_paymentrequests(data) {
    try {
        const requestBody = {
            payeePaymentReference: '0123456789',
            callbackUrl: 'https://webhook.site/3c565038-5dfb-4ff8-add2-c76b0052b6bc',
            payeeAlias: config.payeeAlias,
            payerAlias: data.payerAlias,
            amount: data.amount,
            currency: 'SEK',
            message: data.message,
        };

        const response = await axiosInstance.post('/api/v1/paymentrequests', requestBody);

        if (response.status === 201) {
            const location = response.headers['location'];
            const statusResponse = await axiosInstance.get(location);

            return {
                id: statusResponse.data.id,
                paymentReference: statusResponse.data.paymentReference || '',
                status: statusResponse.data.status,
                url: location,
            };
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error creating payment request:', error.message || error);
        return false;
    }
}

// Receive Payment Status
async function receivePaymentStatus(req, res) {
    try {
        const { id, status } = req.body;
        if (id && status === PAYMENT_STATUS.PAID) {
            const [payment] = await Payments.getPaymentsByPaymentId(id);
            if (!payment) {
                throw new Error('Payment not found.');
            }
            if (payment.status === 2) {
                return sendResponse(res, 400, 'Error', 'Payment already received.', null, null);
            }
            const result = await Payments.updatePaymentsStatus(id, 2);

            if (!result || !result.order_id) {
                throw new Error('Invalid payment update result.');
            }
            commitOrder(result.order_id);
            return sendResponse(res, 201, 'Received', 'Successfully received the payment status.', null, null);
        } else if (id && status === PAYMENT_STATUS.DECLINED) {
            const [payment] = await Payments.getPaymentsByPaymentId(id);
            if (!payment) {
                throw new Error('Payment not found.');
            }
            if (payment.status === 1) {
                const delRes = await deleteById(payment.order_id);
                if (!delRes) {
                    throw new Error('Failed to delete order.');
                } else {
                    return sendResponse(res, 200, 'Declined', 'Successfully declined the payment.', null, null);
                }
            }
        }

        return sendResponse(res, 400, 'Error', 'Invalid payment status or missing ID.', null, null);
    } catch (error) {
        return sendResponse(
            res,
            500,
            'Server Error',
            'An error occurred while processing the payment status.',
            null,
            error.message,
        );
    }
}

// Get Payment Request
async function getPaymentrequests(req, res) {
    try {
        const response = await axiosInstance.get(`/api/v1/paymentrequests/${req.params.requestId}`);
        return res.status(response.status).json({
            id: response.data.id,
            paymentReference: response.data.paymentReference || '',
            status: response.data.status,
        });
    } catch (error) {
        logError('Get Payment Request', error);
        return res.status(500).send(error.message || 'An error occurred.');
    }
}

// Create Refund
async function refunds(req, res) {
    try {
        const requestBody = {
            payeePaymentReference: '0123456789',
            originalPaymentReference: req.body.originalPaymentReference,
            callbackUrl: 'http://localhost:4000/server/api/payments/klaran',
            payerAlias: config.payeeAlias,
            amount: req.body.amount,
            currency: 'SEK',
            message: req.body.message,
        };

        const response = await axiosInstance.post('/api/v1/refunds', requestBody);

        if (response.status === 201) {
            const location = response.headers['location'];
            const statusResponse = await axiosInstance.get(location);

            return res.json({
                url: location,
                token: response.headers['paymentrequesttoken'],
                originalPaymentReference: statusResponse.data.originalPaymentReference,
                status: statusResponse.data.status,
                id: statusResponse.data.id,
            });
        } else {
            return res.status(response.status).send(response.data);
        }
    } catch (error) {
        logError('Create Refund', error);
        return res.status(500).send(error.message || 'An error occurred.');
    }
}

// Get Refund
async function getRefunds(req, res) {
    try {
        const response = await axiosInstance.get(`/api/v1/refunds/${req.params.refundId}`);

        return res.status(response.status).json({
            id: response.data.id,
            originalPaymentReference: response.data.originalPaymentReference || '',
            status: response.data.status,
        });
    } catch (error) {
        logError('Get Refund', error);
        return res.status(500).send(error.message || 'An error occurred.');
    }
}

function logError(context, error) {
    console.error(`Error in ${context}:`, error.message || error);
}

module.exports = {
    swish_paymentrequests,
    receivePaymentStatus,
    getPaymentrequests,
    refunds,
    getRefunds,
};
