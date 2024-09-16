const axios = require('axios');
const orderModel = require('./order.model.js');
const orderItemsModel = require('./orderItems.model.js');

const KLARNA_API_URL = 'https://api.playground.klarna.com';
const KLARNA_AUTH = {
    username: 'dad5d96d-bc63-4ee0-81b2-3fa1969cc4c0',
    password:
        'klarna_test_api_MiluUCFWYXVvTEZxZnE2UGEhamF4WCUxOHIwI3drKHUsZGFkNWQ5NmQtYmM2My00ZWUwLTgxYjItM2ZhMTk2OWNjNGMwLDEsM0NzSUk3azBKYVBabSsrRGhwZW5McUN1NVBoNzh3RG5KS20rZ1Y4UDJxOD0',
};

// Create a Klarna Checkout session
async function createKlarnaSession(orderData) {
    const response = await axios.post(`${KLARNA_API_URL}/checkout/v3/orders`, orderData, {
        auth: KLARNA_AUTH,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response?.data.order_id) {
        return {
            success: true,
            session_id: response?.data.order_id,
            html_snippet: response?.data.html_snippet,
        };
    }
    return {
        success: false,
        message: 'Failed to create Klarna session',
    };
}

// Get order status from Klarna ordermanagement
async function getOrder(klarna_order_id) {
    const response = await axios.get(`${KLARNA_API_URL}/ordermanagement/v1/orders/${klarna_order_id}`, {
        auth: KLARNA_AUTH,
    });
    return response.data;
}

// Get order status from Klarna
async function getOrderStatus(klarna_order_id) {
    const response = await axios.get(`${KLARNA_API_URL}/checkout/v3/orders/${klarna_order_id}`, {
        auth: KLARNA_AUTH,
    });
    return response.data;
}

// Cancel a Klarna order
async function cancelKlarnaOrder(klarna_order_id) {
    const response = await axios.post(
        `${KLARNA_API_URL}/ordermanagement/v1/orders/${klarna_order_id}/cancel`,
        null,
        {
            auth: KLARNA_AUTH,
            headers: {
                'Content-Type': 'application/json',
                'Klarna-Idempotency-Key': klarna_order_id,
            },
        },
    );
    return response.status === 204; // true if successfully canceled
}

// Acknowledge a Klarna order
async function acknowledgeKlarnaOrder(klarna_order_id) {
    const response = await axios.post(
        `${KLARNA_API_URL}/ordermanagement/v1/orders/${klarna_order_id}/acknowledge`,
        null,
        {
            auth: KLARNA_AUTH,
            headers: {
                'Content-Type': 'application/json',
                'Klarna-Idempotency-Key': klarna_order_id,
            },
        },
    );

    return response.status === 204; // true if successfully acknowledged
}

// When reciving the confirmation form the frontend
const validateOrderDetails = async (klarnaOrder, order_id) => {
    const [order] = await orderModel.getById(order_id);
    const orderItems = await orderItemsModel.getItemsByOrderId(order_id);

    let error = '';
    const total = order.total;
    const order_amount = klarnaOrder.order_amount / 100;

    if (total !== order_amount) {
        error = 'Klarna order amount does not match the calculated total';
    }

    const orderItemsMap = new Map(
        orderItems.map((product) => {
            return [product.product_id, product];
        }),
    );

    klarnaOrder.order_lines.forEach(orderElement => {
        if (orderElement.type !== 'shipping_fee') {
            const product = orderItemsMap.get(+orderElement.reference);
            if (!product) {
                error = `Missing product ID: ${orderElement.product_id}`;
                return;
            }
            const klarna_unit_amount = orderElement.total_amount / 100;
            if (product.price !== klarna_unit_amount) {
                error = `Klarna unit amount does not match for product ID: ${orderElement.reference}`;
                return;
            }
        }
    });
    return error;
};

// Report order status when reciving the push notefication
async function completeOrderValidation(klarna_order_id, order_id) {
    try {
        const klarnaOrder = await this.getOrder(klarna_order_id);
        const error = await validateOrderDetails(klarnaOrder, order_id);

        if (error) {
            throw new Error(error);
        }

        const accRes = this.acknowledgeKlarnaOrder(klarna_order_id);
        if (!accRes) {
            throw new Error('Failed to acknowledge Klarna order');
        }

        return { success: true, message: 'Klarna order confirmed' };
    } catch (error) {
        throw new Error(`Failed to retrieve order status: ${error.message}`);
    }
}

// Capture a Klarna order
async function captureKlarnaOrder(klarna_order_id, captureDetails) {
    try {
        const response = await axios.post(
            `${KLARNA_API_URL}/ordermanagement/v1/orders/${klarna_order_id}/captures`,
            captureDetails,
            {
                auth: KLARNA_AUTH,
                headers: {
                    'Content-Type': 'application/json',
                    'Klarna-Idempotency-Key': klarna_order_id, // Unique key to avoid duplicate requests
                },
            },
        );

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: 'Failed to capture Klarna order',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data : error.message,
        };
    }
}

async function fetchOrderCaptures(orderId) {
    try {
        const response = await axios.get(`${KLARNA_API_URL}/ordermanagement/v1/orders/${orderId}/captures`, {
            auth: KLARNA_AUTH,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data : error.message,
        };
    }
}

// Refund a Klarna order
async function refundKlarnaOrder(orderId, refundDetails) {
    try {
        const response = await axios.post(
            `${KLARNA_API_URL}/ordermanagement/v1/orders/${orderId}/refunds`,
            refundDetails,
            {
                auth: KLARNA_AUTH,
                headers: {
                    'Content-Type': 'application/json',
                    'Klarna-Idempotency-Key': orderId, // Unique key to avoid duplicate requests
                },
            },
        );
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data : error.message,
        };
    }
}

// Update authorization for a Klarna order
async function updateKlarnaAuthorization(orderId, authorizationDetails) {
    try {
        const response = await axios.patch(
            `${KLARNA_API_URL}/ordermanagement/v1/orders/${orderId}/authorization`,
            authorizationDetails,
            {
                auth: KLARNA_AUTH,
                headers: {
                    'Content-Type': 'application/json',
                    'Klarna-Idempotency-Key': orderId, // Unique key to avoid duplicate requests
                },
            },
        );

        if (response.status === 200 || response.status === 204) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: 'Failed to update Klarna authorization',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data : error.message,
        };
    }
}

module.exports = {
    createKlarnaSession,
    updateKlarnaAuthorization,
    getOrder,
    getOrderStatus,
    cancelKlarnaOrder,
    acknowledgeKlarnaOrder,
    completeOrderValidation,
    validateOrderDetails,
    captureKlarnaOrder,
    fetchOrderCaptures,
    refundKlarnaOrder,
};
