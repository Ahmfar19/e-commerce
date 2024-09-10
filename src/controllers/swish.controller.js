const { sendResponse } = require('../helpers/apiResponse');
const Payments = require('../models/payments.model');
const OrderItemsModel = require('../models/orderItems.model');
const OrderModel = require('../models/order.model');
const { commitOrder } = require('../helpers/orderUtils');
const { deleteById } = require('../models/order.model');
const {
    swishPaymentRequests,
    getPaymentRequests,
    createRefund,
    getRefund,
    cancelPaymentRequest,
} = require('../models/swish.model');

const PAYMENT_STATUS = {
    CREATED: 'CREATED',
    PAID: 'PAID',
    DECLINED: 'DECLINED',
    PENDING: 'PENDING',
};

// Create Payment Request
async function createPaymentRequest(req, res) {
    const data = req.body;

    console.error('data', data);
    const paymentRequest = await swishPaymentRequests(data);

    if (paymentRequest) {
        return sendResponse(res, 201, 'Created', 'Payment request created successfully.', paymentRequest);
    } else {
        return sendResponse(res, 500, 'Error', 'Failed to create payment request.', null, null);
    }
}

// **Receive Payment Status**
async function receivePaymentStatus(req, res) {
    try {
        const { id, status } = req.body;

        // Retrieve payment details by payment ID
        const [paymentStatus] = await Payments.getPaymentsByPaymentId(id);

        if (!paymentStatus) {
            return sendResponse(res, 404, 'Error', 'Payment not found.', null, null);
        }

        if (paymentStatus.status === 2) {
            return sendResponse(res, 400, 'Error', 'Payment already received.', null, null);
        }

        // Handle payment status
        if (status === PAYMENT_STATUS.PAID) {
            // Update payment status in the database
            const result = await Payments.updatePaymentsStatus(id, 2);
            if (!result || !result.order_id) {
                return sendResponse(res, 500, 'Error', 'Failed to update payment status.', null, null);
            }

            // Commit order after payment is confirmed
            commitOrder(result.order_id);
            return sendResponse(res, 201, 'Received', 'Successfully received the payment status.', null, null);
        } else if (status === PAYMENT_STATUS.DECLINED) {
            if (paymentStatus.status === 1) {
                // Delete the associated order if the payment was declined
                const delRes = await deleteById(paymentStatus.order_id);
                if (!delRes) {
                    return sendResponse(res, 500, 'Error', 'Failed to delete order.', null, null);
                }

                return sendResponse(res, 200, 'Declined', 'Payment request declined successfully.', null, null);
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
async function fetchPaymentRequest(req, res) {
    const paymentRequest = await getPaymentRequests(req.params.requestId);
    if (paymentRequest) {
        return sendResponse(res, 200, 'Ok', 'Successfully retrieved the payment request.', null, paymentRequest);
    }
    return sendResponse(res, 500, 'Error', 'Invalid payment ID.', null, null);
}

// Create Refund
async function createRefundRequest(req, res) {
    const { payment_id } = req.body;

    try {
        if (!payment_id) {
            return sendResponse(res, 400, 'Error', 'Payment ID is required.', null, null);
        }

        const [payment] = await Payments.getPaymentsByPaymentId(payment_id);
        if (!payment) {
            return sendResponse(res, 404, 'Error', 'Payment not found.', null, null);
        }

        if (payment.status !== 2) {
            return sendResponse(res, 400, 'Error', 'Payment not in a paid state.', null, null);
        }

        const paymentData = await getPaymentRequests(payment_id);

        if (!paymentData) {
            return sendResponse(res, 404, 'Error', 'Payment not found on Swish portal.', null, null);
        }

        const refundRequest = await createRefund(paymentData);

        if (refundRequest && refundRequest.status === PAYMENT_STATUS.CREATED) {
            await Payments.updatePaymentsStatusAndPaymentId({
                id: payment.id,
                payment_id: refundRequest.id,
                status: 2,
            });
            return sendResponse(res, 201, 'Created', 'Refund request created successfully.', null, refundRequest);
        }

        return sendResponse(res, 500, 'Error', 'Failed to create refund request.', null, null);
    } catch (error) {
        return sendResponse(
            res,
            500,
            'Server Error',
            'An error occurred while creating the refund request.',
            null,
            error.message,
        );
    }
}

async function receiveRefundStatus(req, res) {
    try {
        const { id, status } = req.body;

        if (id && status === PAYMENT_STATUS.PAID) {
            const [payment] = await Payments.getPaymentsByPaymentId(id);

            if (!payment) {
                return sendResponse(res, 404, 'Error', 'Payment not found.', null, null);
            }

            if (payment.status !== 2) {
                return sendResponse(res, 400, 'Error', 'Payment not in a paid state.', null, null);
            }

            const success = await Payments.updatePaymentsStatusAndPaymentId({
                id: payment.id,
                payment_id: id,
                status: 6, // Refunded
            });

            if (!success) {
                return sendResponse(res, 500, 'Error', 'Failed to update payment with refund ID.', null, null);
            }

            // update the order status and the product qty
            const products = await OrderItemsModel.getItemsByOrderId(payment.order_id);
            const updatedProducts = products?.map((product) => {
                return { ...product, quantity: -product.quantity };
            });
            await OrderModel.updateOrderStatus(payment.order_id, 3); // 3 Cancelled
            await OrderModel.updateProductQuantities(updatedProducts);

            return sendResponse(res, 201, 'Created', 'Refund request created successfully.', null, null);
        } else {
            return sendResponse(res, 400, 'Error', 'Invalid refund status or missing ID.', null, null);
        }
    } catch (error) {
        return sendResponse(
            res,
            500,
            'Server Error',
            'An error occurred while processing the refund status.',
            null,
            error.message,
        );
    }
}

// Get Refund
async function fetchRefund(req, res) {
    const { refundId } = req.params;

    if (!refundId) {
        return sendResponse(res, 400, 'Error', 'Refund ID is required.', null, null);
    }

    try {
        const refund = await getRefund(refundId);

        if (refund) {
            return sendResponse(res, 200, 'Ok', 'Successfully retrieved the refund.', null, refund);
        }
        return sendResponse(res, 404, 'Error', 'Refund not found.', null, null);
    } catch (error) {
        return sendResponse(
            res,
            500,
            'Server Error',
            'An error occurred while fetching the refund.',
            null,
            error.message,
        );
    }
}

// Cancel Payment Request
async function cancelPayment(req, res) {
    const cancelResponse = await cancelPaymentRequest(req.params.requestId);
    if (cancelResponse) {
        return sendResponse(res, 200, 'Ok', 'Payment request successfully canceled.', null, cancelResponse);
    }
    return sendResponse(res, 500, 'Error', 'Failed to cancel payment request.', null, null);
}

module.exports = {
    createPaymentRequest,
    receivePaymentStatus,
    receiveRefundStatus,
    fetchPaymentRequest,
    createRefundRequest,
    fetchRefund,
    cancelPayment,
};
