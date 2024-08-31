const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');

const addProductItems = async (req, res) => {
    try {
        await OrderItems.saveMulti(req.body);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
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

module.exports = {
    getOrderItems,
    updateItems,
    addProductItems,
};
