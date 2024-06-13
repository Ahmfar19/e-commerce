const WishList = require('../models/wishlist.model');
const { sendResponse } = require('../helpers/apiResponse');

const createWishList = async (req, res) => {
    try {
        const wishList = new WishList(req.body);
        await wishList.save();
        sendResponse(res, 201, 'Created', 'Successfully created a wishList.', null, wishList);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getSingleWishList = async (req, res) => {
    try {
        const { id, customer_id } = req.params;
        const signleWishList = await WishList.getSingleById(id, customer_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single wishList.', null, signleWishList);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const updateWishList = async (req, res) => {
    try {
        const { id, customer_id } = req.params;

        const wishList = new WishList(req.body);

        const data = await wishList.updateById(id, customer_id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No wishList found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a wishList.', null, wishList);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteWishList = async (req, res) => {
    try {
        const { id, customer_id } = req.params;
        const data = await WishList.deleteById(id, customer_id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No category found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a category.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getWishLists = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const wishlists = await WishList.getAll(customer_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the wishlists.', null, wishlists);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    createWishList,
    getSingleWishList,
    updateWishList,
    deleteWishList,
    getWishLists,
};
