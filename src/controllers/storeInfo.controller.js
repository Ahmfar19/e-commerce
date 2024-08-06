const StoreInfo = require('../models/storeInfo.model');
const { sendResponse } = require('../helpers/apiResponse');

const getStoreInfo = async (req, res) => {
    try {
        const storeInfo = await StoreInfo.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the storeInfo.', null, storeInfo);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const createStoreInformation = async (req, res) => {
    try {
        const storeInfo = new StoreInfo(req.body);
        await storeInfo.save();
        sendResponse(res, 201, 'Created', 'Successfully created a storeInfo.', null, storeInfo);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateStoreInformation = async (req, res) => {
    try {
        const id = req.params.id;

        const storeInfo = new StoreInfo(req.body);

        const data = await storeInfo.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No storeInfo found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a storeInfo.', null, storeInfo);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteStoreInfo = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await StoreInfo.deleteById(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No storeInfo found for delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a storeInfo.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    createStoreInformation,
    updateStoreInformation,
    getStoreInfo,
    deleteStoreInfo,
};
