const sendResponse = (res, code, statusMessage, message, error, data) => {
    res.send({
        statusCode: code,
        statusMessage: statusMessage,
        ok: [200, 202, 201].includes(code),
        message: message,
        error: error,
        data: data,
    });
};

module.exports = {
    sendResponse,
};

module.exports = {
    sendResponse,
};
