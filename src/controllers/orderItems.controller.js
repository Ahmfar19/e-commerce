const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const addProductItems = async (req, res) => {
    try {
        const { products } = req.body;

        const { success, message, insufficientProducts } = await Product.checkQuantities(products);

        if (!success) {
            return sendResponse(res, 400, 'Bad Request', message, null, insufficientProducts);
        }

        await Promise.all([
            OrderItems.saveMulti(req.body),
            Order.updateProductQuantities(products),
            OrderItems.updateOrderByOrderItems(),
        ]);

        return sendResponse(res, 201, 'Created', 'Successfully created items.', null, null);
    } catch (error) {
        console.error('Error in addProductItems:', error.message);
        return sendResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred.', null, null);
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

const updateItems = async (req, res) => {
    try {
        const id = req.params.id;

        const items = new OrderItems(req.body);

        const data = await items.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No items found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a items.', null, items);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const putOrderItems = async (req, res) => {
    try {
        const { deleteItems, updatedItems } = req.body;

        if (deleteItems?.length) {
            await Promise.all([
                OrderItems.deleteMulti(deleteItems),
                Order.updateProductQuantitiesPlus(deleteItems),
                OrderItems.updateOrderByOrderItems(),
            ]);
        }

        if (updatedItems?.length) {
            const { success, message, insufficientProducts } = await Product.checkQuantities(updateItems);

            if (!success) {
                return sendResponse(res, 400, 'Bad Request', message, null, insufficientProducts);
            }
            await Promise.all([
                OrderItems.updateMulti(updatedItems),
                Order.updateProductQuantities(updatedItems),
            ]);
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a items.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getOrderItems,
    updateItems,
    addProductItems,
    putOrderItems,
};
