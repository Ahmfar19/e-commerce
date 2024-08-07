const Category = require('../models/category.model');
const { sendResponse } = require('../helpers/apiResponse');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.getAllCategories();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the categories.', null, categories);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getSingleCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const singleCategory = await Category.getCategoryById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single category.', null, singleCategory);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        sendResponse(res, 201, 'Created', 'Successfully created a category.', null, category);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const category = new Category(req.body);

        const data = await category.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No category found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a category.', null, category);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Category.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No category found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a category.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getCategories,
    getSingleCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
