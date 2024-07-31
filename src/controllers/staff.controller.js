const Staff = require('../models/staff.model');
var jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
const { decodeJWTToken, handleDecrypt, generateUniqueUserId, handleEncrypt } = require('../authentication');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
const path = require('path');
const fs = require('fs');

function searchImageByName(directoryPath, imageName) {
    const imageNameWithoutExtension = path.parse(imageName).name;

    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            const foundImage = files.find(file => {
                const fileNameWithoutExtension = path.parse(file).name;
                return fileNameWithoutExtension === imageNameWithoutExtension;
            });
            if (foundImage) {
                const imagePath = path.join(directoryPath, foundImage);
                resolve(imagePath);
            } else {
                resolve(null); // Image not found
            }
        });
    });
}

async function uploadImage(file, userID) {
    const tempPath = file.path;
    const fileExtension = path.extname(file.originalname);
    const newFileName = `user_${userID}${fileExtension}`;
    const uploadPath = 'public/users';

    if (!fs.existsSync(path.join(uploadPath))) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const targetPath = path.join(uploadPath, newFileName);

    try {
        const foundImage = await searchImageByName(uploadPath, newFileName);
        // Remove any existing image for this user before uploading the new image
        if (foundImage) {
            fs.unlinkSync(foundImage);
        }

        fs.renameSync(tempPath, targetPath);
        return newFileName;
    } catch (error) {
        throw new Error('Error uploading image:', error);
    }
}

const createStaff = async (req, res) => {
    try {
        const { username, fname, lname, phone, email, role, password } = req.body;

        const checkUser = await Staff.checkIfUserExisted(email, username);

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
            role,
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
};

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
        const singleStaff = await Staff.getStaffById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single staff.', null, singleStaff);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateStaff = async (req, res) => {
    try {
        const { username, email } = req.body;
        const id = req.params.id;

        const checkUser = await Staff.checkUserUpdate(username, email, id);

        if (checkUser.length) {
            return res.json({
                status: 406,
                ofk: false,
                stautsCode: 'Not Acceptable',
                message: 'ec_alert_user_editFail_userNameOrEmail_exsists',
            });
        }

        const userData = req.body;

        if (req.file) {
            const imageName = await uploadImage(req.file, id);
            userData.image = imageName;
        }

        const user = new Staff(userData);
        await user.updateStaff(id);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a staff.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
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
        const [staff] = await Staff.loginUser(email_username);

        if (staff) {
            const match = await comparePassword(password, staff.password);

            if (match) {
                const expiresIn = rememberMe ? '30d' : '1d';
                const finger_print = fingerprint + String(staff.staff_id);
                const verifier = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                // Authentication and user session
                const sessionID = generateUniqueUserId();
                const cidHash = handleEncrypt(String(staff.staff_id));
                req.session.staff = {
                    email: email_username,
                    fingerPrint: finger_print,
                    staff_id: staff.staff_id,
                };
                req.session.SID = sessionID;
                req.session.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                const cookiesOption = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    maxAge: 24 * 60 * 60 * 1000,
                };

                res.cookie('SID', sessionID, cookiesOption);
                res.cookie('verifier', verifier, cookiesOption);
                res.cookie('cidHash', cidHash, cookiesOption);

                // Remove the password hash from the returned datars
                delete staff.password;
                return res.status(200).json({
                    staff: staff,
                    authenticated: true,
                    accessToken: verifier,
                });
            } else {
                return res.json({ error: 'Password or Email is incorrect' });
            }
        } else {
            return res.json({ error: 'User does not exist in the database' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        res.clearCookie('SID');
        res.clearCookie('cidHash');
        res.clearCookie('verifier');
        if (err) {
            return res.status(500).json({ ok: false, message: 'Logout failed' });
        }
        res.json({ ok: true });
    });
};

const verifyToken = async (req, res) => {
    const { fingerprint } = req.body;
    const accessToken = req.cookies?.verifier;
    const cidHash = req.cookies?.cidHash;

    try {
        if (accessToken && cidHash && fingerprint && req.session.staff) {
            const decoded = await decodeJWTToken(accessToken);
            const cid = handleDecrypt(cidHash);

            if (!decoded || !cid) {
                return res.json({
                    statusCode: 401,
                    message: 'invalid token or customer identifer',
                });
            }
            const checkUserDevice = fingerprint + cid;
            if (checkUserDevice === decoded.id) {
                return res.json({
                    statusCode: 200,
                    staff_id: cid,
                    authenticated: true,
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
                message: 'Unauthorized: Missing authentication token',
            });
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getUsersImage = async (req, res) => {
    // Extract the file name from the request parameters
    const filename = req.params.filename;
    const uploadPath = 'public/users';
    const filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;
        res.json({ img: dataURI });
    } else {
        res.status(404).send('File not found');
    }
};

module.exports = {
    createStaff,
    getstaffs,
    getSingleStaff,
    updateStaff,
    deleteStaff,
    updateStaffPassword,
    login,
    logout,
    verifyToken,
    getUsersImage,
};
