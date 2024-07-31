var jwt = require('jsonwebtoken');
const config = require('config');
const CryptoJS = require('crypto-js');

const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
const CRYPTO_SECRET_KEY = config.get('CRYPTO_SECRET_KEY');

const handleEncrypt = (text, secretKey) => {
    secretKey = secretKey || CRYPTO_SECRET_KEY;
    if (typeof text !== 'string' || typeof secretKey !== 'string') {
        return null;
    }
    try {
        const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
        return ciphertext;
    } catch {
        return null;
    }
};

const handleDecrypt = (encryptedText, secretKey) => {
    secretKey = secretKey || CRYPTO_SECRET_KEY;
    let originalText = null;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
        originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) {
            throw new Error('Decryption failed. Possible incorrect key or corrupted ciphertext.');
        }
    } catch {
        return null;
    }
    return originalText;
};

const decodeJWTToken = (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                resolve(false);
            } else {
                resolve(decoded);
            }
        });
    });
};

// eslint-disable-next-line no-unused-vars
async function verifyFingerprint(fingerprint, token) {
    const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
    return new Promise((resolve) => {
        jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                resolve(false);
            } else {
                const authenticated = fingerprint === decoded.id;
                resolve(authenticated);
            }
        });
    });
}

// Function to generate a unique user ID
function generateUniqueUserId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const isAuthorized = (req, res, next) => {
    const reqIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (reqIpAddress !== req.session.ipAddress) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }
    if (req.get('User-Agent') !== req.session.userAgent) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }
    return next();
};

async function isAuthenticated(req, res, next) {
    const reqIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // eslint-disable-next-line no-unused-vars
    const accessToken = req.cookies?.verifier;
    const hashedCustomerId = req.cookies?.cidHash;
    const customer_id = handleDecrypt(hashedCustomerId);

    if (req.session && req.session.user) {
        if (reqIpAddress !== req.session.ipAddress) {
            return res.status(401).json({ ok: false, message: 'Unauthorized' });
        }
        if (req.get('User-Agent') !== req.session.userAgent) {
            return res.status(401).json({ ok: false, message: 'Unauthorized' });
        }
        if (+customer_id !== +req.session.user.customer_id) {
            return res.status(401).json({ ok: false, message: 'Unauthorized' });
        }
        return next();
    }
    return res.status(401).json({ ok: false, message: 'Unauthorized' });

    // The use of the fingerprint.
    // const authenticated = await verifyFingerprint(fingerprint, token);
    // if (authenticated) {
    //     next();
    // } else {
    //     res.status(403).send('Forbidden');
    // }
}

const initSIDSession = (req, res) => {
    if (!req.session?.SID) {
        const sessionID = generateUniqueUserId();
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        req.session.ipAddress = ipAddress;
        req.session.SID = sessionID;
        req.session.userAgent = req.get('User-Agent');
        res.cookie('SID', sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: 'Session established',
            SID: sessionID,
        });
    } else {
        return res.status(200).json({
            message: 'Session already exists',
            SID: req.session.SID,
            user: req.session.user,
        });
    }
};

// Middleware to log user activity
// eslint-disable-next-line no-unused-vars
const logUserActivity = (req, res, next) => {
    if (req.session && req.session.user) {
        const activity = `[${
            new Date().toISOString()
        }] User ${req.session.user.email} accessed ${req.originalUrl} from IP ${req.session.user.ipAddress}`;
        console.log(activity);
    }
    next();
};
// app.use(logUserActivity);

const isAdmin = (req, res, next) => {
    const whiteList = ['/staff/login', '/staff/logout'];
    if (whiteList.includes(req.path)) {
        return next();
    }

    const reqIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // eslint-disable-next-line no-unused-vars
    const accessToken = req.cookies?.verifier;
    const hashedCustomerId = req.cookies?.cidHash;
    const staff_id = handleDecrypt(hashedCustomerId);

    if (req.session && req.session.staff) {
        if (reqIpAddress !== req.session.ipAddress) {
            return res.status(401).json({ ok: false, message: 'Unauthenticated' });
        }
        if (+staff_id !== +req.session.staff.staff_id) {
            return res.status(401).json({ ok: false, message: 'Unauthenticated' });
        }
        return next();
    }
    return res.status(401).json({ ok: false, message: 'Unauthenticated' });
};

module.exports = {
    isAuthenticated,
    isAuthorized,
    decodeJWTToken,
    handleDecrypt,
    handleEncrypt,
    generateUniqueUserId,
    initSIDSession,
    isAdmin,
};
