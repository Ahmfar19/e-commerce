const bcrypt = require('bcryptjs');
var CryptoJS = require('crypto-js');
const User = require('../models/customer.model');
const config = require('config');
const CRYPTO_SECRET_KEY = config.get('CRYPTO_SECRET_KEY');
const { sendResponse } = require('../helpers/apiResponse');
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

var encryptToken = (token) => {
    const result = CryptoJS.AES.encrypt(token, CRYPTO_SECRET_KEY).toString();
    return result;
};

// Decrypt
var handleDecrypt = (encryptedText) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, CRYPTO_SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decrypted = handleDecrypt(token);

        const [email, tokenExpiryDate] = decrypted.split('$');

        const user = await User.checkIfUserExisted(email);

        if (!user) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid or expired token.', null, null);
        }

        if (tokenExpiryDate < Date.now()) {
            return sendResponse(res, 401, 'Unauthorized', 'invalid authentication token', null, null);
        }

        user[0].registered = true;

        const newuser = new User(user[0]);
        await newuser.updateUser(user[0].customer_id);

        res.redirect('/login');
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    getNowDate_time,
    tokenExpireDate,
    getFutureDateTime,
    isDateTimeInPast,
    encryptToken,
    handleDecrypt,
    verifyEmail,
};
