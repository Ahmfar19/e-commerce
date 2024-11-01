const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('config');

const SWISH_CALLBACK = config.get('SWISH_CALLBACK');
const SWISH_REFUND_CALLBACK = config.get('SWISH_REFUND_CALLBACK');

const paymentMessage = 'Almondo';

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
    payeeAlias: '1230161182',
    host: 'https://cpc.getswish.net/swish-cpcapi',
    qrHost: 'https://mpc.getswish.net/qrg-swish',
    cert: path.resolve(__dirname, '../ssl/swishProduction/prod.pem'),
    key: path.resolve(__dirname, '../ssl/swishProduction/prod.key'),
    passphrase: null,
};
// ssl/prod.pem
const swishConfig = process.env.NODE_ENV === 'production' ? prodConfig : testConfig;

const axiosInstance = axios.create({
    baseURL: swishConfig.host,
    httpsAgent: new require('https').Agent({
        cert: fs.readFileSync(swishConfig.cert),
        key: fs.readFileSync(swishConfig.key),
        ca: swishConfig.ca ? fs.readFileSync(swishConfig.ca) : undefined,
        passphrase: swishConfig.passphrase,
    }),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create Payment Request
async function swishPaymentRequests(data) {
    // https://webhook.site/3c565038-5dfb-4ff8-add2-c76b0052b6bc
    try {
        const requestBody = {
            callbackUrl: SWISH_CALLBACK,
            payeeAlias: swishConfig.payeeAlias,
            payerAlias: data.payerAlias,
            amount: data.amount,
            currency: 'SEK',
            payeePaymentReference: data.order_id,
            message: paymentMessage,
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

// Get Payment Request
async function getPaymentRequests(requestId) {
    try {
        const response = await axiosInstance.get(`/api/v1/paymentrequests/${requestId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting payment request:', error.message || error);
        return null;
    }
}

// Create Refund
async function createRefund(paymentData) {
    try {
        const refundRequest = {
            originalPaymentReference: paymentData.paymentReference,
            callbackUrl: SWISH_REFUND_CALLBACK,
            payerAlias: paymentData.payeeAlias,
            payeeAlias: paymentData.payerAlias,
            amount: paymentData.amount,
            currency: paymentData.currency,
            message: paymentMessage,
        };

        const response = await axiosInstance.post('/api/v1/refunds', refundRequest);

        if (response.status === 201) {
            const location = response.headers['location'];
            const statusResponse = await axiosInstance.get(location);

            return {
                url: location,
                token: response.headers['paymentrequesttoken'],
                originalPaymentReference: statusResponse.data.originalPaymentReference,
                status: statusResponse.data.status,
                id: statusResponse.data.id,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error creating refund:', error.message || error);
        return null;
    }
}

// Get Refund
async function getRefund(refundId) {
    try {
        const response = await axiosInstance.get(`/api/v1/refunds/${refundId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting refund:', error.message || error);
        return null;
    }
}

// Cancel Payment Request
async function cancelPaymentRequest(requestId) {
    try {
        const patchBody = [{
            op: 'replace',
            path: '/status',
            value: 'cancelled',
        }];

        const response = await axiosInstance.patch(`/api/v1/paymentrequests/${requestId}`, patchBody, {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error canceling payment request:', error.message || error);
        return null;
    }
}

module.exports = {
    swishPaymentRequests,
    getPaymentRequests,
    createRefund,
    getRefund,
    cancelPaymentRequest,
};
