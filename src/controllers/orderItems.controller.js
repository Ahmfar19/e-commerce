const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { sequelize } = require('../databases/mysql.db');

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
        const { deletedItems, updatedItems, order_id } = req.body;

        if (!deletedItems.length && !updatedItems.length) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid request body.', null, null);
        }

        if (deletedItems?.length) {
            transaction = await sequelize.transaction();

            await OrderItems.deleteMulti(deletedItems, transaction);
            await Order.updateProductQuantities(deletedItems, transaction);
            await OrderItems.updateOrderByOrderItems(order_id, transaction);

            await transaction.commit();
        }

        if (updatedItems?.length) {
            const { success, message, insufficientProducts } = await Product.checkQuantities(updatedItems);

            if (!success) {
                return sendResponse(res, 409, 'Conflict', message, null, insufficientProducts);
            }

            transaction = await sequelize.transaction();
            const newUpdatedItems = updatedItems.map((updatedItem) => {
                return {
                    ...updatedItem,
                    orginalQuantity: updatedItem.quantity,
                    quantity: updatedItem.quantity - updatedItem.oldQuantity,
                };
            });
            await OrderItems.updateMulti(newUpdatedItems, transaction);
            await Order.updateProductQuantities(newUpdatedItems, transaction);
            await OrderItems.updateOrderByOrderItems(order_id, transaction);
            await transaction.commit();
        }
        sendResponse(res, 202, 'Accepted', 'Successfully edit a items.', null, null);
    } catch (err) {
        await transaction?.rollback();
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getOrderItems,
    addProductItems,
    putOrderItems,
};
