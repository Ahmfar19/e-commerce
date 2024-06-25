const User = require('../models/customer.model');
const { hashPassword, comparePassword } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
var jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

const createUser = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password, address, phone, personal_number } = req.body;

        const checkuser = await User.checkIfUserExisted(email, username);
       
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword.success) {
            return res.json({
                error: hashedPassword.error,
            });
        }
     
        if (checkuser.length && checkuser[0].registered) {
            return sendResponse(res, 406, 'Not Acceptable', 'user already existed.', null, null);

        } else if (checkuser.length && !checkuser[0].registered) {
           
            const user = new User({
                username,
                first_name,
                last_name,
                email,
                password: hashedPassword.data,
                address,
                phone,
                personal_number,
                registered: true,
            });
          
            await user.updateUser(checkuser[0].customer_id);
            return sendResponse(res, 201, 'Created', 'Successfully created a user.', null, user);
        } else {

            const user = new User({
                username,
                first_name,
                last_name,
                email,
                password: hashedPassword.data,
                address,
                phone,
                personal_number,
                registered: true,
            });

            await user.createUser();

            sendResponse(res, 201, 'Created', 'Successfully created a user.', null, user);
        }


    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the users.', null, users);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;
        const singleUser = await User.getUserById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single user.', null, singleUser);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { username, email } = req.body;

        const checkUser = await User.checkUserUpdate(username, email, id);

        if (checkUser.length) {
            return res.json({
                status: 406,
                stautsCode: 'Not Acceptable',
                message: 'dek_alert_user_editFail_userNameOrEmail_exsists',
            });
        }

        const user = new User(req.body);

        await user.updateUser(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated a user.', null, null);
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

        const user = await User.getUserById(id);

        if (!user.length) {
            return sendResponse(res, 403, 'Forbidden', 'The user does not exist', null, null);
        }

        const match = await comparePassword(password, user[0].password);

        if (match !== true) {
            return sendResponse(res, 400, 'Bad Request', 'Current password does not match', null, null);
        }

        const newPaawordHash = await hashPassword(new_password);

        await User.updatePassword(id, newPaawordHash.data);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a password.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.deleteUser(id);
        sendResponse(res, 202, 'Ok', 'Successfully deleted a user.', null, data);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const login = async (req, res) => {
    try {
        const { email, password, rememberMe, fingerprint } = req.body;
        const data = await User.loginUser(email);
        if (data.length) {
            const match = await comparePassword(password, data[0].password);
            if (match) {
                const expiresIn = rememberMe ? '30d' : '1d';
                const finger_print = fingerprint + String(data[0].customer_id);

                const token = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                res.json({
                    user: data[0],
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

module.exports = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    login,
    verifyToken,
};
