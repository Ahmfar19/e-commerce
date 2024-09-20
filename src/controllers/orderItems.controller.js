const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { sequelize } = require('../databases/mysql.db');
const { createRefundRequest } = require('./swish.controller');
const { updateKlarnaOrder } = require('./klarna.controller');

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
        const { payment_id, deletedItems, updatedItems, order_id, payment_type_id } = req.body;

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

        let refundAmount = 0;
        let newSubTotal = 0;
        if (deletedItems?.length) {
            transaction = await sequelize.transaction();

            refundAmount = deletedItems.reduce((acc, product) => {
                if (!product.returned) {
                    acc += +product.price;
                }
                return acc;
            }, 0);

            await OrderItems.deleteMulti(deletedItems, transaction);
            await Order.updateProductQuantities(deletedItems, transaction);
            newSubTotal = await OrderItems.updateOrderByOrderItems(order_id, transaction);
        }

        if (updatedItems?.length) {
            const newUpdatedItems = updatedItems.map((updatedItem) => {
                return {
                    ...updatedItem,
                    orginalQuantity: updatedItem.quantity,
                    quantity: updatedItem.quantity - updatedItem.oldQuantity,
                };
            });

            refundAmount += newUpdatedItems.reduce((acc, product) => {
                if (product.quantity < 0) {
                    acc += (product.quantity * -1) * product.price;
                }
                return acc;
            }, 0);

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
            newSubTotal = await OrderItems.updateOrderByOrderItems(order_id, transaction);
        }

        if (refundAmount && newSubTotal) {
            // When Swish
            if (payment_type_id === 2) {
                // Make a refund with this amount
                createRefundRequest(req, res, refundAmount, transaction);
            }
            // When Klarna
            if (payment_type_id === 3) {
                req.body.klarna_order_id = payment_id;
                req.body.refundAmount = refundAmount;
                req.body.newSubTotal = newSubTotal;
                updateKlarnaOrder(req, res, transaction);
            }
            return;
        } else {
            transaction.commit();
        }

        sendResponse(res, 202, 'Accepted', 'Successfully edit a items.', null, null);
    } catch (err) {
        await transaction?.rollback();
        sendResponse(res, 500, null, err.message || err, 'ec_server_fail', null);
    }
};

module.exports = {
    getOrderItems,
    addProductItems,
    putOrderItems,
};
