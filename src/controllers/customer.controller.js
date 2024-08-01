const Customer = require('../models/customer.model');
const { hashPassword, comparePassword, tokenExpireDate } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
var jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
const { sendVerificationEmail } = require('../controllers/sendEmail.controller');
const { decodeJWTToken, handleDecrypt, handleEncrypt } = require('../authentication');

const Joi = require('joi');

const passwordSchema = Joi.string().min(8).max(128).required().messages({
    'string.base': 'ec_validation_customer_password_mustBeString',
    'string.min': 'ec_validation_customer_password_minLength',
    'string.max': 'ec_validation_customer_password_maxLength',
    'any.required': 'ec_validation_customer_password_required',
});

const createUser = async (req, res) => {
    try {
        const { fname, lname, email, password, address, phone, zip, city, isCompany } = req.body;

        const { error } = passwordSchema.validate(password);
        if (error) {
            return res.status(400).json({
                error: `${error.details[0].message}`,
            });
        }

        // Check if the customer already exists
        const checkCustomer = await Customer.checkIfUserExisted(email);

        // Hash the password
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword.success) {
            return res.json({
                error: hashedPassword.error,
            });
        }

        // If the customer already exists and is registered
        if (checkCustomer.length && checkCustomer[0].registered) {
            return sendResponse(res, 406, 'Not Acceptable', 'Customer already exists.', null, null);
        } else {
            const tokenExpiryDate = tokenExpireDate();
            const token = `${email}$${tokenExpiryDate}`;
            const encryptedToken = handleEncrypt(token);

            const customer = new Customer({
                fname,
                lname,
                email,
                password: hashedPassword.data,
                address,
                phone,
                zip,
                city,
                isCompany,
                registered: false,
            });

            // If the customer exists but is not registered, update the existing record
            if (checkCustomer.length && !checkCustomer[0].registered) {
                await customer.updateUser(checkCustomer[0].customer_id);
            } else {
                await customer.createUser();
            }

            const verificationLink = `http://localhost:3000/customer/verification?token=${
                encodeURIComponent(encryptedToken)
            };`;

            await sendVerificationEmail(email, verificationLink);

            return sendResponse(
                res,
                201,
                'Created',
                'Successfully created a customer. Please check your email to verify your account.',
                null,
                customer,
            );
        }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await Customer.getAllUsers();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the users.', null, users);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getCustomersCount = async (req, res) => {
    try {
        const [customers] = await Customer.getCount();
        const count = customers?.row_count || 0;
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the number of products.', null, count);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;
        const singleUser = await Customer.getUserById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single custoemr.', null, singleUser);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { email } = req.body;

        const checkUser = await Customer.checkUserUpdate(email, id);

        if (checkUser.length) {
            return sendResponse(res, 406, 'Not Acceptable', 'ec_profile_user_editFail_Email_exsists', null, null);
        }

        const custoemr = new Customer(req.body);

        await custoemr.updateUser(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated a custoemr.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updateUserPassword = async (req, res) => {
    const id = req.params.id;
    const { password, new_password, verify_password } = req.body;
    // Validate the password using Joi
    const { error } = passwordSchema.validate(new_password);
    if (error) {
        return res.status(400).json({
            error: `${error.details[0].message}`,
        });
    }
    try {
        if (new_password !== verify_password) {
            return sendResponse(res, 400, 'Bad Request', 'Passwords do not match', null, null);
        }

        const custoemr = await Customer.getUserById(id);

        if (!custoemr.length) {
            return sendResponse(res, 403, 'Forbidden', 'The custoemr does not exist', null, null);
        }

        const match = await comparePassword(password, custoemr[0].password);

        if (match !== true) {
            return sendResponse(res, 400, 'Bad Request', 'Current password does not match', null, null);
        }

        const newPaawordHash = await hashPassword(new_password);

        await Customer.updatePassword(id, newPaawordHash.data);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a password.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Customer.deleteUser(id);
        sendResponse(res, 202, 'Ok', 'Successfully deleted a custoemr.', null, data);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ ok: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('SID');
        res.clearCookie('cidHash');
        res.clearCookie('verifier');
        res.json({ ok: true });
    });
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe, fingerprint } = req.body;
        const data = await Customer.loginUser(email);
        if (data.length === 1) {
            const [customer] = data;

            if (!customer.registered) {
                return sendResponse(res, 406, 'Not Acceptable', 'ec_alter_user_notExsists', null, null);
            }

            const match = await comparePassword(password, customer.password);

            if (match) {
                const expiresIn = rememberMe ? '30d' : '1d';
                const fingerPrint = fingerprint + String(customer.customer_id);
                const verifier = jwt.sign({ id: fingerPrint }, JWT_SECRET_KEY, { expiresIn });

                // Authentication and user session
                req.session.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                req.session.customer = {
                    email,
                    fingerPrint,
                    customer_id: customer.customer_id,
                };

                // Set nessery cookies when logged in
                const cidHash = handleEncrypt(String(customer.customer_id));
                const cookiesOption = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    maxAge: 24 * 60 * 60 * 1000,
                };
                res.cookie('cidHash', cidHash, cookiesOption);
                res.cookie('verifier', verifier, cookiesOption);
                res.json({
                    customer: customer,
                    authenticated: true,
                    accessToken: verifier,
                });
                return res;
            } else {
                return res.json({ error: 'ec_alter_passwrodOrEmail_wrong' });
            }
        } else {
            return sendResponse(res, 406, 'Not Acceptable', 'ec_alter_user_notExsists', null, null);
        }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const verifyToken = async (req, res) => {
    const { fingerprint } = req.body;
    const accessToken = req.cookies?.verifier;
    const hashedCustomerId = req.cookies?.cidHash;

    try {
        if (accessToken && hashedCustomerId && fingerprint && req.session.customer) {
            const decoded = await decodeJWTToken(accessToken);
            const customer_id = handleDecrypt(hashedCustomerId);

            if (!decoded || !customer_id) {
                return res.json({
                    statusCode: 401,
                    message: 'invalid token or customer identifer',
                });
            }

            const checkUserDevice = fingerprint + customer_id;
            if (checkUserDevice === decoded.id) {
                return res.json({
                    statusCode: 200,
                    authenticated: true,
                    customer_id,
                });
            } else {
                return res.json({
                    statusCode: 401,
                    authenticated: false,
                });
            }
        } else {
            return res.json({
                statusCode: 401,
                authenticated: false,
                message: 'Unauthorized: no authentication token provided',
            });
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getCustomersFilter = async (req, res) => {
    try {
        const { key, value } = req.query;
        if (!key || !value) {
            return sendResponse(res, 400, 'Bad Request', 'Please provide a key and value', null, null);
        }
        const customers = await Customer.getCustomerByFilter(key, value);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the customers.', null, customers);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    login,
    verifyToken,
    getCustomersCount,
    logout,
    getCustomersFilter,
};
