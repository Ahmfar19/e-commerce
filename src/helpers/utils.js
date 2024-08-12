const bcrypt = require('bcryptjs');
const User = require('../models/customer.model');
const { sendResponse } = require('../helpers/apiResponse');
const { handleDecrypt } = require('../authentication');

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return dateTimeString;
}

async function hashPassword(password) {
    // Number of salt rounds (the higher, the more secure but slower)
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return { success: true, data: hashedPassword };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

function getNowDate_time() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to match SQL month format
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

function tokenExpireDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day}`;
    return formattedDateTime;
}

function getFutureDateTime() {
    const now = new Date();
    const futureTime = new Date(now.getTime() + (60 * 60 * 1000)); // Adding one hour in milliseconds
    const year = futureTime.getFullYear();
    const month = String(futureTime.getMonth() + 1).padStart(2, '0');
    const day = String(futureTime.getDate()).padStart(2, '0');
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutes = String(futureTime.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return dateTimeString;
}

function isDateTimeInPast(dateTimeToCheck) {
    const currentDateTime = new Date(getCurrentDateTime());
    const providedDateTime = new Date(dateTimeToCheck);
    return providedDateTime.getTime() < currentDateTime.getTime();
}

const verifyEmail = async (req, res) => {
    const { token } = req.body;
    try {
        
        
        const decrypted = handleDecrypt(token);
        if (!decrypted) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid or expired token.', null, null);
        }

        const [email, tokenExpiryDate] = decrypted.split('$');
        const [user] = await User.checkIfUserExisted(email);

        if (!user) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid or expired token.', null, null);
        }

        if (user.registered) {
            return sendResponse(res, 400, 'Bad Request', 'Email already verified', null, null);
        }
        
        if (tokenExpiryDate < Date.now()) {
            return sendResponse(res, 401, 'Unauthorized', 'invalid authentication token', null, null);
        }
        
        const customerId = user.customer_id;
        user.registered = true;

        const data = user;
        delete data.customer_id;
        const newuser = new User(data);
      
        await newuser.updateUser(customerId);

        return sendResponse(res, 200, 'Verified', 'The customer is verified', null, null);
    } catch (error) {
        sendResponse(
            res,
            500,
            'Internal Server Error',
            'An error occurred during verification.',
            error.message || error,
            null,
        );
    }
};

const isProduction = () => {
    const NODE_ENV = process.env.NODE_ENV || 'production';
    return NODE_ENV === 'production';
};

module.exports = {
    hashPassword,
    comparePassword,
    getNowDate_time,
    tokenExpireDate,
    getFutureDateTime,
    isDateTimeInPast,
    handleDecrypt,
    verifyEmail,
    isProduction,
};
