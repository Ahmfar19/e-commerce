const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { sequelize } = require('../databases/mysql.db');
const { createRefundRequest } = require('./swish.controller');
const { updateKlarnaOrder } = require('./klarna.controller');
const PaymentRefundModel = require('../models/paymentRefund.model');
const Payments = require('../models/payments.model');

const addProductItems = async (req, res) => {
    let transaction = null;
    try {
        const { order_id, products } = req.body;
        if (!order_id || isNaN(order_id) || !products?.length) {
            return sendResponse(res, 400, 'Bad Request', 'The request contains invalid parameters.', null, null);
        }

        const { success, message, insufficientProducts } = await Product.checkQuantities(products);

        if (!success) {
            return sendResponse(res, 409, 'Conflict', message, null, insufficientProducts);
        }

        transaction = await sequelize.transaction();

        await OrderItems.saveMulti(req.body, transaction);

        await Order.updateProductQuantities(products, transaction);

        await OrderItems.updateOrderByOrderItems(order_id, transaction);

        await transaction.commit();

        return sendResponse(res, 201, 'Created', 'Successfully created items.', null, null);
    } catch (error) {
        await transaction?.rollback();
        return sendResponse(res, 500, 'Internal Server Error', error.message, null, null);
    }
};

const getOrderItems = async (req, res) => {
    const id = req.params.id;
    try {
        const items = await OrderItems.getItemsByOrderId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all order items.', null, items);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const putOrderItems = async (req, res) => {
    let transaction = null;

    try {
        const { payment_id, payment_type_id, deletedItems, updatedItems, order_id } = req.body;

        if (!deletedItems.length && !updatedItems.length) {
            return sendResponse(
                res,
                400,
                'Bad Request',
                'Invalid request body.',
                'ec_Invalid_request_parameters',
                null,
            );
        }

        const [oldOrder] = await Order.getOrder(order_id);

        if (!oldOrder) {
            return sendResponse(
                res,
                404,
                'Error',
                'The oldOrder is not found',
                'ec_order_cancel_klarna_error',
                null,
            );
        }

        if (deletedItems?.length) {
            transaction = await sequelize.transaction();
            await OrderItems.deleteMulti(deletedItems, transaction);
            await Order.updateProductQuantities(deletedItems, transaction);
            await OrderItems.updateOrderByOrderItems(order_id, transaction);
        }

        if (updatedItems?.length) {
            const newUpdatedItems = updatedItems.map((updatedItem) => {
                return {
                    ...updatedItem,
                    orginalQuantity: updatedItem.quantity,
                    quantity: updatedItem.quantity - updatedItem.oldQuantity,
                };
            });

            const getItems = newUpdatedItems.filter((item) => item.quantity > 0);

            const { success, message, insufficientProducts } = getItems?.length
                ? await Product.checkQuantities(getItems)
                : { success: true };

            if (!success) {
                return sendResponse(res, 409, 'Conflict', message, null, insufficientProducts);
            }

            if (!transaction) {
                transaction = await sequelize.transaction();
            }

            await OrderItems.updateMulti(newUpdatedItems, transaction);
            await Order.updateProductQuantities(newUpdatedItems, transaction);
            await OrderItems.updateOrderByOrderItems(order_id, transaction);
        }

        const [updatedOrder] = await Order.getOrder(order_id, transaction);

        if (!updatedOrder) {
            await transaction?.rollback();
            return sendResponse(
                res,
                404,
                'Error',
                'The updatedOrder is not found',
                'ec_order_cancel_klarna_error',
                null,
            );
        }

        // When Swish
        if (payment_type_id === 2) {
            // Make a refund with this amount
            const refundAmount = Number(oldOrder.total) - Number(updatedOrder.total);

            const swishRefund = await createRefundRequest(payment_id, refundAmount);

            if (!swishRefund.success) {
                await transaction.rollback();
                return sendResponse(
                    res,
                    404,
                    'Error',
                    swishRefund.statusMessage || 'Faild to create a refund request',
                    swishRefund.error,
                    null,
                );
            }

            const newRefundEntry = new PaymentRefundModel({
                status: 1, // PENDING
                order_id: order_id,
                refund_id: swishRefund.refund_id,
                amount: refundAmount,
            });

            const intertedId = await newRefundEntry.save(transaction);

            if (!intertedId) {
                await transaction.rollback();
                return sendResponse(
                    res,
                    404,
                    'Error',
                    'Couldnt create the a refund.',
                    'ec_order_cancel_klarna_error',
                    null,
                );
            }
            await transaction?.commit();
            await Payments.updatePaymentsStatus(payment_id, 8); // 8 - SUB_REFUNDEN
            return sendResponse(res, 201, 'Created', 'Refund request created successfully.', null, {
                payment_id: swishRefund.refund_id,
            });
        }

        // When Klarna
        if (payment_type_id === 3) {
            const klarnaRes = await updateKlarnaOrder(
                payment_id,
                oldOrder,
                updatedOrder,
                deletedItems,
                updatedItems,
            );

            if (!klarnaRes.success) {
                await transaction.rollback();
                return sendResponse(
                    res,
                    404,
                    'Error',
                    klarnaRes.statusMessage || 'Faild to create a refund request',
                    klarnaRes.error,
                    null,
                );
            }
        }
        await transaction.rollback();
        return sendResponse(
            res,
            202,
            'Accepted',
            'Successfully edited the items and done an updated/refund.',
            null,
            null,
        );
    } catch (err) {
        await transaction?.rollback();
        return sendResponse(res, 500, null, err.message || err, 'ec_server_fail', null);
    }
};

module.exports = {
    getOrderItems,
    addProductItems,
    putOrderItems,
};
