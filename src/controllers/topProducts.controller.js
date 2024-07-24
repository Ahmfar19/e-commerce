const TopProduct = require('../models/topProducts.model');
const { sendResponse } = require('../helpers/apiResponse');

// Create a new top product
const createTopProduct = async (req, res) => {
    try {
        const { product_id } = req.body;
        const topProduct = new TopProduct({ product_id });
        const id = await topProduct.save();
        sendResponse(res, 201, 'Created', 'Successfully created a top product.', null, { id });
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Get all top products
const getTopProducts = async (req, res) => {
    try {
        const topProducts = await TopProduct.getAll();
        sendResponse(res, 200, 'OK', 'Successfully retrieved all top products.', null, topProducts);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getCustomTopProducts = async (req, res) => {
    try {
        const customTopProducts = await TopProduct.getCustomPopular();
        sendResponse(res, 200, 'OK', 'Successfully retrieved all custom top products.', null, customTopProducts);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Get a single top product by ID
const getTopProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const topProduct = await TopProduct.getById(id);

        if (topProduct) {
            sendResponse(res, 200, 'OK', 'Top product retrieved successfully.', null, topProduct);
        } else {
            sendResponse(res, 404, 'Not Found', 'Top product not found.', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Update a top product by ID
const updateTopProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { product_id, display_order } = req.body;

        const updated = await TopProduct.updateById(id, { product_id, display_order });

        if (updated.affectedRows > 0) {
            sendResponse(res, 202, 'Accepted', 'Successfully updated the top product.', null, null);
        } else {
            sendResponse(res, 404, 'Not Found', 'Top product not found for update.', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Delete a top product by ID
const deleteTopProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await TopProduct.deleteById(id);

        if (result.affectedRows > 0) {
            sendResponse(res, 202, 'Accepted', 'Successfully deleted the top product.', null, null);
        } else {
            sendResponse(res, 404, 'Not Found', 'Top product not found for delete.', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    createTopProduct,
    getTopProducts,
    getTopProduct,
    updateTopProduct,
    deleteTopProduct,
    getCustomTopProducts,
};
