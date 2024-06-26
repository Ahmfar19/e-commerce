const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/customer.model');
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
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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


const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const handleEncrypt = async (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const handleDecrypt = async (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

function isDateTimeInPast(dateTimeToCheck) {
    const currentDateTime = new Date(getCurrentDateTime());
    const providedDateTime = new Date(dateTimeToCheck);
    return providedDateTime.getTime() < currentDateTime.getTime();
}

const verifyEmail = async (req, res) => {
    
    const { token } = req.query;
    try {
        const decrypted = await handleDecrypt(token)

        const [email, year, month, day] = decrypted.split('-');

        const tokenExpiryDate = `${year}-${month}-${day}`;

        const user = await User.checkIfUserExisted(email);

        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        if (tokenExpiryDate < Date.now()) {
            return res.status(400).send('Token has expired.');
        }

        user[0].registered = true;

        const newuser = new User(user[0]);
        await newuser.updateUser(user[0].customer_id);

        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    getNowDate_time,
    tokenExpireDate,
    getFutureDateTime,
    isDateTimeInPast,
    handleEncrypt,
    handleDecrypt,
    verifyEmail
};
