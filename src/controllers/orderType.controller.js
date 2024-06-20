const OrderType = require('../models/orderType.model');
const { sendResponse } = require('../helpers/apiResponse');

const getOrderTypes = async (req, res) => {
    try {
        const orderTypes = await OrderType.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the orderTypes.', null, orderTypes);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getSingleOrderType = async (req, res) => {
    try {
        const id = req.params.id;
        const singleOrderType = await OrderType.getById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single orderType.', null, singleOrderType);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const createOrderType = async (req, res) => {
    try {
        const orderType = new OrderType(req.body);
        await orderType.save();
        sendResponse(res, 201, 'Created', 'Successfully created a orderType.', null, orderType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateOrderType = async (req, res) => {
    try {
        const id = req.params.id;

        const orderType = new OrderType(req.body);

        const data = await orderType.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No orderType found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a orderType.', null, orderType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteOrderType = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await OrderType.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No orderType found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a orderType.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getOrderTypes,
    createOrderType,
    getSingleOrderType,
    updateOrderType,
    deleteOrderType,
};
