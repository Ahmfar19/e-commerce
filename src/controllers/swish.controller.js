/* eslint-disable no-unused-vars */
const request = require('request');
const fs = require('fs');
const path = require('path');
const { sendResponse } = require('../helpers/apiResponse');
const Payments = require('../models/payments.model');
const OrderItems = require('../models/orderItems.model');
const Order = require('../models/order.model');

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

const config = testConfig;

// Create Payment Request
function paymentrequests(data) {
    // https://webhook.site
    const json = {
        payeePaymentReference: '0123456789',
        callbackUrl: 'https://webhook.site/8c4933fa-f439-43da-aa0c-64c3682d9ce8',
        payeeAlias: config.payeeAlias,
        payerAlias: data.payerAlias,
        amount: data.amount,
        currency: 'SEK',
        message: data.message,
    };

    const options = requestOptions('POST', `${config.host}/api/v1/paymentrequests`, json);

    return new Promise((resolve) => {
        request(options, (error, response, body) => {
            if (!response) {
                return resolve(false);
            }
            if (response.statusCode == 201) {
                const location = response.headers['location'];
                const token = response.headers['paymentrequesttoken'];
                const opt = requestOptions('GET', location);
                request(opt, (err, resp) => {
                    if (!response) {
                        resolve(false);
                    }
                    const status = {
                        id: resp.body['id'],
                        paymentReference: resp.body['paymentReference'] || '',
                        status: resp.body['status'],
                        url: location,
                    };
                    return resolve(status);
                });
            } else {
                return resolve(false);
            }
        });
    });
}

async function receivePaymentStatus(req, res) {
    try {
        const { id, status } = req.body;

        if (id && status === 'PAID') {
            const result = await Payments.updatePaymentsStatus(id, 2);
            if (!result || !result.order_id) {
                throw new Error('Invalid payment update result.');
            }
            const products = await OrderItems.getItemsByOrderId(result.order_id);

            if (!products || products.length === 0) {
                throw new Error('No products found for the given order.');
            }
            await Order.updateProductQuantities(products);
            return sendResponse(res, 201, 'Received', 'Successfully received the payment status.', null, null);
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
function getPaymentrequests(req, res) {
    const options = requestOptions('GET', `${config.host}/api/v1/paymentrequests/${req.params.requestId}`);

    request(options, (error, response, body) => {
        logResult(error, response);

        if (!response) {
            res.status(500).send(error);
            return;
        }

        res.status(response.statusCode);
        if (response.statusCode == 200) {
            res.json({
                id: response.body['id'],
                paymentReference: response.body['paymentReference'] || '',
                status: response.body['status'],
            });
        } else {
            res.send(body);
            return;
        }
    });
}

// Create Refund
function refunds(req, res) {
    const clURL = 'https://webhook.site/a8f9b5c2-f2da-4bb8-8181-fcb84a6659ea';
    const json = {
        payeePaymentReference: '0123456789',
        originalPaymentReference: req.body.originalPaymentReference,
        callbackUrl: 'http://localhost:4000/server/api/payments/klaran',
        payerAlias: config.payeeAlias,
        amount: req.body.amount,
        currency: 'SEK',
        message: req.body.message,
    };

    const options = requestOptions('POST', `${config.host}/api/v1/refunds`, json);

    request(options, (error, response, body) => {
        if (!response) {
            res.status(500).send(error);
            return;
        }

        res.status(response.statusCode);
        if (response.statusCode == 201) {
            const location = response.headers['location'];
            const token = response.headers['paymentrequesttoken'];
            const opt = requestOptions('GET', location);

            request(opt, (err, resp, bod) => {
                const id = resp.body['id'];
                const originalPaymentReference = resp.body['originalPaymentReference'];
                const status = resp.body['status'];

                res.json({
                    url: location,
                    token: token,
                    originalPaymentReference: originalPaymentReference,
                    status: status,
                    id: id,
                });
            });
        } else {
            res.send(body);
            return;
        }
    });
}

// Get Refund
function getRefunds(req, res) {
    const options = requestOptions('GET', `${config.host}/api/v1/refunds/${req.params.refundId}`);

    console.log(req);

    request(options, (error, response, body) => {
        logResult(error, response);

        if (!response) {
            res.status(500).send(error);
            return;
        }

        res.status(response.statusCode);
        if (response.statusCode == 200) {
            res.json({
                id: response.body['id'],
                originalPaymentReference: response.body['originalPaymentReference'] || '',
                status: response.body['status'],
            });
        } else {
            res.send(body);
            return;
        }
    });
}

function requestOptions(method, uri, body) {
    return {
        method: method,
        uri: uri,
        json: true,
        body: body,
        'content-type': 'application/json',
        cert: fs.readFileSync(config.cert),
        key: fs.readFileSync(config.key),
        ca: config.ca ? fs.readFileSync(config.ca) : null,
        passphrase: config.passphrase,
    };
}

function logResult(error, response) {
    if (error) {
        console.log(error);
    }
    if (response) {
        console.log(response.statusCode);
        console.log(response.headers);
        console.log(response.body);
    }
}

module.exports = {
    paymentrequests,
    receivePaymentStatus,
    getPaymentrequests,
    refunds,
    getRefunds,
};
