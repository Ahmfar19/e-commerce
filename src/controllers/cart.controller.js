const Cart = require('../models/cart.model');
const { sendResponse } = require('../helpers/apiResponse');

const createCart = async (req, res) => {
    try {
        const cart = new Cart(req.body);
        await cart.save();
        sendResponse(res, 201, 'Created', 'Successfully created a cart.', null, cart);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getSingleCart = async (req, res) => {
    try {
        const { id, customer_id } = req.params;
        const singleCart = await Cart.getSingleById(id, customer_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single singleCart.', null, singleCart);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const updateCart = async (req, res) => {
    try {
        const { id, customer_id } = req.params;

        const cart = new Cart(req.body);

        const data = await cart.updateById(id, customer_id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No cart found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a cart.', null, cart);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteCart = async (req, res) => {
    try {
        const { id, customer_id } = req.params;
        const data = await Cart.deleteById(id, customer_id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No cart found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a cart.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getCarts = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const carts = await Cart.getAll(customer_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the carts.', null, carts);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
}

module.exports = {
    createCart,
    getSingleCart,
    updateCart,
    deleteCart,
    getCarts
};
