const Shipping = require('../models/shipping.model');
const { sendResponse } = require('../helpers/apiResponse');

const createShipping = async (req, res) => {
    try {
        const shipping = new Shipping(req.body);
        await shipping.save();
        sendResponse(res, 201, 'Created', 'Successfully created a shipping.', null, shipping);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getShippings = async (req, res) => {
    try {
        const shippings = await Shipping.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the shippings.', null, shippings);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updateShipping = async (req, res) => {
    try {
        const id = req.params.id;

        const shipping = new Shipping(req.body);

        const data = await shipping.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No shipping found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a shipping.', null, shipping);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleShipping = async (req, res) => {
    try {
        const id = req.params.id;
        const singleShipping = await Shipping.getById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single shipping.', null, singleShipping);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const deleteShipping = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Shipping.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No shipping found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a shipping.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    createShipping,
    updateShipping,
    getShippings,
    getSingleShipping,
    deleteShipping,
};
