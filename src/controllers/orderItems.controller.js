const OrderItems = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');

const getOrderItems = async (req, res) => {
    const id = req.params.id;
    try {
        const items = await OrderItems.getItemsByOrderId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all order items.', null, items);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    getOrderItems,
};
