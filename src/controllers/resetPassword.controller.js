const mailMessags = require('../helpers/emailMessages');
const { sendResponse } = require('../helpers/apiResponse');
const ResetPassword = require('../models/resetPassword.model');
const { sendReqularEmail } = require('./sendEmail.controller');
const crypto = require('crypto');
const { hashPassword, getFutureDateTime, isDateTimeInPast } = require('../helpers/utils');


const forgetPassword = async (req, res) => {
    try {
        const checkUser = await ResetPassword.checkIfUserExisted(req.body.email);

        console.error('checkUserw', checkUser);

        // check if user exists in staff (users table)
        if (checkUser.length) {
            console.error(11);
            const [user] = checkUser;
            if (!user.registered) {
                console.error(user.registered);
                return sendResponse(res, 404, 'Fail', 'ec_resetPasword_userNotregistred', null, null);
            }
            // check if user exists in reset_password table
            const checkIfExistedInResetPassword = await ResetPassword.checkIfExistedInResetTable(req.body.email);

            const pinCode = crypto.randomInt(100000, 1000000).toString();
            const expiresAt = getFutureDateTime();
            let msg = '';

            if (checkIfExistedInResetPassword.length) {
                const newResetInformation = new ResetPassword({
                    email: req.body.email,
                    pinCode: pinCode,
                    expiresAt: expiresAt,
                });
                await newResetInformation.updateResetPasswordInformation(req.body.email);
                msg = 'ec_resetPassword_newPinCode';
            } else {
                const reset_password = new ResetPassword({
                    email: req.body.email,
                    pinCode: pinCode,
                    expiresAt: expiresAt,
                });
                await reset_password.save();
                msg = 'ec_resetPassword_newPinCode2';
            }
            const title = mailMessags.pinMessage.title;
            const body = mailMessags.pinMessage.body.replace('{0}', pinCode);

            sendReqularEmail(req.body.email, title, body);
            return sendResponse(res, 200, 'Fail', msg, null, null);
        } else {
            return sendResponse(res, 404, 'Fail', 'ec_resetPassword_emailNotFound', null, null);
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const checkPinCode = async (req, res) => {
    const { pinCode, email } = req.body;

    try {
        const ckeckPin = await ResetPassword.checkPinIfExisted(pinCode, email);

        if (ckeckPin.length) {
            const resetPasswordInformation = await ResetPassword.getResetPassword(email, pinCode);

            if (isDateTimeInPast(resetPasswordInformation[0]?.expiresAt)) {
                await ResetPassword.deleteUserAfterUpdatePassword(email);
                return res.status(400).json({
                    error: 'PIN code has expired , Please re-order the pin agin',
                    ok: false,
                });
            }

            return res.status(200).json({
                msg: 'pinCode is Correct',
                ok: true,
            });
        } else {
            return res.status(406).json({
                msg: 'pinCode is not Correct',
                ok: false,
            });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, pinCode, new_password, verify_password } = req.body;

    try {
        const resetPasswordInformation = await ResetPassword.getResetPassword(email, pinCode);

        if (resetPasswordInformation.length === 0) {
            return res.status(400).json({
                error: 'Invalid PIN code.',
                ok: false,
            });
        }

        if (new_password !== verify_password) {
            throw new Error('Passwords do not match');
        }
        const hashedPassword = await hashPassword(new_password);

        await ResetPassword.updatePassword(resetPasswordInformation[0].email, hashedPassword.data);

        await ResetPassword.deleteUserAfterUpdatePassword(resetPasswordInformation[0].email);

        return res.status(200).json({
            msg: 'Password has been updated',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    forgetPassword,
    checkPinCode,
    resetPassword,
};
