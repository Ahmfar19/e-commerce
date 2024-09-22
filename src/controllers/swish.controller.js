const { sendResponse } = require('../helpers/apiResponse');
const Payments = require('../models/payments.model');
const OrderItemsModel = require('../models/orderItems.model');
const OrderModel = require('../models/order.model');
const PaymentRefundModel = require('../models/paymentRefund.model');
const { commitOrder } = require('../helpers/orderUtils');
const { deleteById } = require('../models/order.model');
const Shipping = require('../models/shipping.model');
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
async function createRefundRequest(payment_id, refundAmount) {
    try {
        if (!payment_id || !refundAmount) {
            return { success: false, error: 'ec_order_cancel_klarna_error' };
        }

        const [payment] = await Payments.getPaymentsByPaymentId(payment_id);
        if (!payment) {
            return { success: false, error: 'ec_order_cancel_klarna_error' };
        }

        // The payment is not in a paid/subrefunded state
        if (payment.status !== 2 && payment.status !== 8) {
            return {
                success: false,
                statusMessage: 'Payment not in a paid/subrefunded state.',
                error: 'ec_order_cancel_order_notPaid',
            };
        }

        let paymentData = await getPaymentRequests(payment_id);

        if (!paymentData || (+paymentData.payeePaymentReference != +payment.order_id)) {
            return {
                success: false,
                statusMessage: 'Payment not found on Swish portal.',
                error: 'ec_order_cancel_klarna_error',
            };
        }

        if (refundAmount > paymentData.amount) {
            return {
                success: false,
                statusMessage: 'Refund amount exceeds the payment amount.',
                error: 'ec_order_cancel_klarna_error',
            };
        }

        paymentData.amount = refundAmount;

        const refundRequest = await createRefund(paymentData);
        if (refundRequest && refundRequest.status === PAYMENT_STATUS.CREATED) {
            return {
                success: true,
                refund_id: refundRequest.id,
            };
        }

        return {
            success: false,
            statusMessage: 'Failed to create refund request.',
            error: 'ec_order_cancel_klarna_error',
        };
    } catch {
        return {
            success: false,
            statusMessage: 'Failed to create refund request.',
            error: 'ec_order_cancel_klarna_error',
        };
    }
}

async function cancelSwishOrder(req, res) {
    const { order_id, payment_id } = req.body;

    if (!order_id || !payment_id) {
        return sendResponse(
            res,
            400,
            'Error',
            'Missing order_id or payment_id.',
            'ec_Invalid_request_parameters',
            null,
        );
    }

    let paymentData = await getPaymentRequests(payment_id);

    if (!paymentData) {
        return sendResponse(
            res,
            400,
            'Error',
            'Payment not found on Swish portal..',
            'ec_order_cancel_klarna_error',
            null,
        );
    }

    const [order] = await OrderModel.getOrder(order_id);

    if (!order) {
        return sendResponse(
            res,
            400,
            'Error',
            'Order not found in the database.',
            'ec_order_cancel_klarna_error',
            null,
        );
    }

    // Check if the order is already cancelled
    if (order.type_id === 3) {
        return sendResponse(
            res,
            400,
            'Error',
            'Order is already cancelled.',
            'ec_order_cancel_klarna_error',
            null,
        );
    }

    const [shipping] = await Shipping.getShippingByname(order.shipping_name);

    if (!shipping) {
        return sendResponse(
            res,
            400,
            'Error',
            'Shipping method not found in the database.',
            'ec_order_cancel_klarna_error',
            null,
        );
    }

    let refundAmount = order.total;
    if (order.type_id === 2 && !order.shipping_price) {
        refundAmount = refundAmount - shipping.shipping_price;
    }
    if (order.type_id === 2 && order.shipping_price) {
        refundAmount = order.sub_total;
    }

    const refundResult = await createRefundRequest(payment_id, refundAmount);

    if (refundResult.success) {
        await Payments.updatePaymentsStatus(payment_id, 6); // 6 - REFUNDED

        // Update the order status and the product qty
        const products = await OrderItemsModel.getItemsByOrderId(order_id);
        const updatedProducts = products?.map((product) => {
            return { ...product, quantity: -product.quantity };
        });

        await OrderModel.updateProductQuantities(updatedProducts);

        // Update the orderitems to be returned
        await OrderItemsModel.deleteMulti(products);

        let refundedAmount = await PaymentRefundModel.sumAmountByOrderId(order_id);
        if (refundedAmount) {
            // Cancel the order and update the order total/subtotal
            await OrderModel.updateOrderAfterCancelleation({
                order_id,
                shipping_price: order.shipping_price || 0,
                sub_total: order.sub_total + refundedAmount,
                total: order.total + refundedAmount,
                type_id: 3, // Cancelled
            });
        } else {
            // Just cancel the order
            await OrderModel.updateOrderStatus(order_id, 3);
        }

        // Create a refund payment record in the refund_payments table
        await (new PaymentRefundModel({
            status: 1, // PENDING
            order_id: order_id,
            refund_id: refundResult.refund_id,
            amount: refundAmount,
        })).save();

        return sendResponse(res, 200, 'Cancelled', 'Order cancelled successfully.', null, {
            payment_id: refundResult.refund_id,
        });
    }
    return sendResponse(res, 500, 'Error', 'Failed to cancel the order.', refundResult.error, null);
}

async function receiveRefundStatus(req, res) {
    try {
        const { id, status } = req.body;

        if (id && status === PAYMENT_STATUS.PAID) {
            const [refundPayment] = await PaymentRefundModel.getByRefundId(id);

            if (!refundPayment) {
                return sendResponse(res, 404, 'Error', 'RefundPayment not found.', null, null);
            }

            if (refundPayment.status !== 1) {
                return sendResponse(res, 400, 'Error', 'The refund is alredy done.', null, null);
            }

            const success = await PaymentRefundModel.updateStatusByRefundId({
                refund_id: id,
                status: 2, // PAID
            });

            if (!success) {
                return sendResponse(res, 500, 'Error', 'Failed to update RefunPayment with refund ID.', null, null);
            }

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
    cancelSwishOrder,
    createPaymentRequest,
    receivePaymentStatus,
    receiveRefundStatus,
    fetchPaymentRequest,
    createRefundRequest,
    fetchRefund,
    cancelPayment,
};
