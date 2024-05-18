const sendResponse = (res, code, statusMessage, message, error, data) => {
    res.status(code).json({
        statusCode: code,
        statusMessage: statusMessage,
        message: message,
        error: error,
        data: data,
    });
};

module.exports = {
    sendResponse,
};
