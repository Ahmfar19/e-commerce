const axios = require('axios');

const KLARNA_API_URL = 'https://api.playground.klarna.com'; // Klarna's playground environment
const KLARNA_AUTH = {
    username: 'dad5d96d-bc63-4ee0-81b2-3fa1969cc4c0',
    password: 'klarna_test_api_MiluUCFWYXVvTEZxZnE2UGEhamF4WCUxOHIwI3drKHUsZGFkNWQ5NmQtYmM2My00ZWUwLTgxYjItM2ZhMTk2OWNjNGMwLDEsM0NzSUk3azBKYVBabSsrRGhwZW5McUN1NVBoNzh3RG5KS20rZ1Y4UDJxOD0',
};

// Skapa en Klarna Checkout-session
async function createKlarnaSession(orderData) {
    try {
        const response = await axios.post(`${KLARNA_API_URL}/checkout/v3/orders`, orderData, {
            auth: KLARNA_AUTH,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating Klarna session:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const paymentrequests = async (req, res) => {
    const orderData = {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-SE',
        order_amount: 10000,
        order_tax_amount: 2000,
        order_lines: [
            {
                type: 'physical',
                reference: '123050',
                name: 'Shoes',
                quantity: 1,
                unit_price: 10000,
                tax_rate: 2500,
                total_amount: 10000,
                total_tax_amount: 2000,
            },
        ],
        merchant_urls: {
            terms: 'https://www.example.com/terms',
            checkout: 'https://www.example.com/checkout?klarna_order_id={checkout.order.id}',
            confirmation: 'https://www.example.com/confirmation?klarna_order_id={checkout.order.id}',
            push: 'https://www.example.com/api/klarna/push?klarna_order_id={checkout.order.id}',
        },
    };

    try {
        const session = await createKlarnaSession(orderData);
        res.json({ session_id: session.order_id, html_snippet: session.html_snippet });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Klarna session' });
    }
};

module.exports = {
    paymentrequests
};
