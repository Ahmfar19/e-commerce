const Customer = require('../models/customer.model');
const { hashPassword, comparePassword, tokenExpireDate, encryptToken } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
var jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
const { sendVerificationEmail } = require('../controllers/sendEmail.controller');

const createUser = async (req, res) => {
    try {
        const { fname, lname, email, password, address, phone } = req.body;

        const checkCustomer = await Customer.checkIfUserExisted(email);

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword.success) {
            return res.json({
                error: hashedPassword.error,
            });
        }

        if (checkCustomer.length && checkCustomer[0].registered) {
            return sendResponse(res, 406, 'Not Acceptable', 'custoemr already existed.', null, null);
        } else {
            const tokenExpiryDate = tokenExpireDate();
            const token = `${email}$${tokenExpiryDate}`;
            const encryptedToken = encryptToken(token);

            const custoemr = new Customer({
                fname,
                lname,
                email,
                password: hashedPassword.data,
                address,
                phone,
                registered: false,
            });

            if (checkCustomer.length && !checkCustomer[0].registered) {
                await custoemr.updateUser(checkCustomer[0].customer_id);
            } else {
                await custoemr.createUser();
            }

            const verificationLink = `http://localhost:4000/api/verify-email?token=${
                encodeURIComponent(encryptedToken)
            };`;

            await sendVerificationEmail(email, verificationLink);

            return sendResponse(
                res,
                201,
                'Created',
                'Successfully created a custoemr. Please check your email to verify your account.',
                null,
                custoemr,
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

const login = async (req, res) => {
    try {
        const { email, password, rememberMe, fingerprint } = req.body;
        const data = await Customer.loginUser(email);

        if (data.length === 1) {
            const [custoemr] = data;

            if (!custoemr.registered) {
                return sendResponse(res, 406, 'Not Acceptable', 'Customer is not veriferd', null, null);
            }

            const match = await comparePassword(password, custoemr.password);
            if (match) {
                const expiresIn = rememberMe ? '30d' : '1d';
                const finger_print = fingerprint + String(custoemr.customer_id);

                const token = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                res.json({
                    customer: custoemr,
                    authenticated: true,
                    accessToken: token,
                });

                return res;
            } else {
                return res.json({ error: 'Password or Email is incorrect' });
            }
        } else {
            return sendResponse(res, 406, 'Not Acceptable', 'User does not exist in the database', null, null);
        }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const verifyToken = async (req, res) => {
    const { customer_id, fingerprint } = req.body;

    
    try {
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1];

            if (token) {
                jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
                    if (error) {
                        return res.json({
                            statusCode: 401,
                            message: 'invalid token',
                        });
                    } else {
                        const checkUserDevice = fingerprint + customer_id;
                        if (checkUserDevice === decoded.id) {
                            return res.json({
                                statusCode: 200,
                                authenticated: true,
                            });
                        } else {
                            return res.json({
                                statusCode: 401,
                                authenticated: false,
                            });
                        }
                    }
                });
            } else {
                return res.json({
                    statusCode: 401,
                    message: 'Unauthorized: invalid authentication token',
                });
            }
        } else {
            return res.json({
                statusCode: 401,
                message: 'Unauthorized: Missing authentication token',
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
    getCustomersFilter,
};
