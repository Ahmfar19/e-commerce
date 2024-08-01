const Discount = require('../models/discounts.model');
const { sendResponse } = require('../helpers/apiResponse');
const cron = require('node-cron');
const { getNowDateForDeleteDiscount } = require('../helpers/utils');

const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the discounts.', null, discounts);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getSingleDiscount = async (req, res) => {
    try {
        const id = req.params.id;
        const singleDiscount = await Discount.getById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single discount.', null, singleDiscount);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const createDiscount = async (req, res) => {
    try {
        const { discount_value, start_date, end_date, product_id, category_id } = req.body;
        const discount = new Discount({
            discount_value,
            start_date,
            end_date,
        });

        const discount_id = await discount.save();

        await Discount.updateProductDiscountId(discount_id, product_id, category_id);

        sendResponse(res, 201, 'Created', 'Successfully created a discount.', null, discount);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateDiscount = async (req, res) => {
    try {
        const id = req.params.id;
        const discount = new Discount(req.body);
        const data = await discount.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No discount found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a discount.', null, discount);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Discount.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No discount found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a discount.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEndedDiscount =  () => {
    cron.schedule('0 0 * * *', async () => {
       const date = getNowDateForDeleteDiscount()
       const [year, month, day] = date.split('-');
       await Discount.deleteDiscountByEndDate(year, month, day)
    });
}


module.exports = {
    getDiscounts,
    getSingleDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    deleteEndedDiscount
};
