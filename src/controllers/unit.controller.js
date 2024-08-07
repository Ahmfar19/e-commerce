const Unit = require('../models/unit.model');
const { sendResponse } = require('../helpers/apiResponse');

const getUnits = async (req, res) => {
    try {
        const units = await Unit.getAllUnits();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the units.', null, units);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getSingleUnit = async (req, res) => {
    try {
        const id = req.params.id;
        const singleUnit = await Unit.getUnitById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single unit.', null, singleUnit);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const createUnit = async (req, res) => {
    try {
        const unit = new Unit(req.body);
        await unit.save();
        sendResponse(res, 201, 'Created', 'Successfully created a unit.', null, unit);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateUnit = async (req, res) => {
    try {
        const id = req.params.id;

        const unit = new Unit(req.body);

        const data = await Unit.updateById(id, unit);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No unit found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a unit.', null, unit);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteUnit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Unit.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                ok: false,
                statusCode: 'Bad Request',
                message: 'No unit found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a unit.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getUnits,
    getSingleUnit,
    createUnit,
    updateUnit,
    deleteUnit,
};
