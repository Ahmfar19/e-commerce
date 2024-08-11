const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');

// Set up HTTPS agent with SSL certificates
const agent = new https.Agent({
    cert: fs.readFileSync(path.join(__dirname, './swishCrt/Swish_Merchant_TestCertificate_1234679304.pem'), {
        encoding: 'utf8',
    }),
    key: fs.readFileSync(path.join(__dirname, './swishCrt/Swish_Merchant_TestCertificate_1234679304.key'), {
        encoding: 'utf8',
    }),
    ca: fs.readFileSync(path.join(__dirname, './swishCrt/Swish_TLS_RootCA.pem'), { encoding: 'utf8' }),
});

// Create an Axios instance with the HTTPS agent
const client = axios.create({
    httpsAgent: agent,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Generate a UUID
function createId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to create a payment request
async function createPaymentRequest(amount, message) {
    const instructionUUID = createId();

    const data = {
        payeePaymentReference: '0123456789',
        payerAlias: '46700240563',
        payeeAlias: '1231111111', // Ensure this is your correct Swish number
        currency: 'SEK',
        callbackUrl: 'https://misk-anbar.administreramer.se/',
        amount,
        message,
    };

    try {
        const response = await client.post('https://mss.cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests', data);

        if (response.status === 201) {
            // Log the response details
            console.log('Response Body:', response.data);

            // Extract the location URL
            const locationUrl = response.headers.location;
            console.log('Location URL:', locationUrl);

            const detailsResponse = await client.get(locationUrl);

            console.log('rs', detailsResponse.data);
            // Return the details or handle as needed
            return { id: instructionUUID, details: detailsResponse.data };
        }
    } catch (error) {
        console.error('Error creating payment request:', error.response ? error.response.data : error.message);
    }
}

// Test the function
// setTimeout(() => {
//     createPaymentRequest("100.00", "Kingston USB Flash Drive 8 GB")
//         .then(result => {
//             if (result) {
//                 console.log('Payment Request Details:', result);
//             }
//         });
// }, 1000);
