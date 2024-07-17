
const Staff = require('../models/staff.model');
var jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');


const createStaff = async (req, res) => {
    try {
        const { username, fname, lname, phone, email, password } = req.body
        const checkUser = await Staff.checkIfUserExisted(email, username)

        if (checkUser.length) {
            return res.status(406).send({
                statusCode: 406,
                ok: false,
                statusMessage: 'Not Acceptable',
                message: 'user already existed.',
            });
        }

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword.success) {
            return res.json({
                error: hashedPassword.error,
            });
        }

        const user = new Staff({
            username,
            fname,
            lname,
            phone,
            email,
            password: hashedPassword.data,
        });

        await user.save();

        return sendResponse(
            res,
            201,
            'Created',
            'Successfully created a staff.',
            null,
            user,
        );

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

const getstaffs = async (req, res) => {
    try {
        const staffs = await Staff.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the staffs.', null, staffs);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleStaff = async (req, res) => {
    try {
        const id = req.params.id;
        const singleStaff = await Staff.getStaffById(id)
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single staff.', null, singleStaff);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }

};

const updateStaff = async (req, res) => {
    try {
        const id = req.params.id;
        const { email } = req.body;

        const checkUser = await Staff.checkUserUpdate(email, id);
       
        if (checkUser.length) {
            return sendResponse(res, 406, 'Not Acceptable', 'ec_profile_user_editFail_Email_exsists', null, null);
        }

        const user = new Staff(req.body);

        await user.updateStaff(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated a staff.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const updateStaffPassword = async (req, res) => {
    const id = req.params.id;
    const { password, new_password, verify_password } = req.body;

    try {
        if (new_password !== verify_password) {
            return sendResponse(res, 400, 'Bad Request', 'Passwords do not match', null, null);
        }

        const user = await Staff.getStaffById(id);

        if (!user.length) {
            return sendResponse(res, 403, 'Forbidden', 'The user does not exist', null, null);
        }

        const match = await comparePassword(password, user[0].password);

        if (match !== true) {
            return sendResponse(res, 400, 'Bad Request', 'Current password does not match', null, null);
        }

        const newPaawordHash = await hashPassword(new_password);

        await Staff.updatePassword(id, newPaawordHash.data);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a password.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const deleteStaff = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Staff.delete(id);
        sendResponse(res, 202, 'Ok', 'Successfully deleted a staff.', null, data);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const login = async (req, res) => {
    const { email_username, password, rememberMe, fingerprint } = req.body;

    try {
        const data = await Staff.loginUser(email_username);
     
        if (data.length > 0) {

            const match = await comparePassword(password, data[0].password);

            if (match) {
                const expiresIn = rememberMe ? "30d" : "1d";
                const finger_print = fingerprint + String(data[0].staff_id)
                const token = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                res.json({
                    user: data[0],
                    authenticated: true,
                    accessToken: token
                });

                return res;

            } else {
                return res.json({ error: "Password or Email is incorrect" });
            }
        } else {
            return res.json({ error: "User does not exist in the database" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const verifyToken = async (req, res) => {
    const { staff_id, fingerprint } = req.body;

    try {

        if (req?.headers?.authorization?.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]

            if (token) {

                jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {

                    if (error) {
                        return res.json({
                            statusCode: 401,
                            message: "invalid token",
                        });

                    } else {

                        const checkUserDevice = fingerprint + staff_id
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
                    message: "Unauthorized: invalid authentication token",
                });
            }

        } else {
            return res.json({
                statusCode: 401,
                message: "Unauthorized: Missing authentication token",
            });
        }

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }

}


module.exports = {
    createStaff,
    getstaffs,
    getSingleStaff,
    updateStaff,
    deleteStaff,
    updateStaffPassword,
    login,
    verifyToken,
};

