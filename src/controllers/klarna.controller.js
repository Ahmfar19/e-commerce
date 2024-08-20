const axios = require('axios');

const KLARNA_API_URL = 'https://api.playground.klarna.com'; // Klarna's playground environment
const KLARNA_AUTH = {
    username: 'dad5d96d-bc63-4ee0-81b2-3fa1969cc4c0',
    password:
        'klarna_test_api_MiluUCFWYXVvTEZxZnE2UGEhamF4WCUxOHIwI3drKHUsZGFkNWQ5NmQtYmM2My00ZWUwLTgxYjItM2ZhMTk2OWNjNGMwLDEsM0NzSUk3azBKYVBabSsrRGhwZW5McUN1NVBoNzh3RG5KS20rZ1Y4UDJxOD0',
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

const klarna_paymentrequests = async (orderData) => {
    try {
        const session = await createKlarnaSession(orderData);
        // res.json({ session_id: session.order_id, html_snippet: session.html_snippet });
        return { session_id: session.order_id, html_snippet: session.html_snippet };
    } catch (error) {
        // res.status(500).json({ error: 'Failed to create Klarna session' });
        return false;
    }
};

const receivePaymentStatus = async (req, res) => {
    const { klarna_order_id } = req.query;
    try {
        const response = await axios.get(`${KLARNA_API_URL}/checkout/v3/orders/${klarna_order_id}`, {
            auth: KLARNA_AUTH,
        });

        const orderStatus = response.data.status;
        const paymentStatus = response.data.payment_status;

        // Skicka status tillbaka till frontend
        res.status(200).json({
            success: true,
            status: orderStatus,
            paymentStatus: paymentStatus,
            order: response.data,
        });
    } catch (error) {
        console.error('Error fetching Klarna order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve order status',
            error: error.message,
        });
    }
};

module.exports = {
    klarna_paymentrequests,
    receivePaymentStatus,
};
