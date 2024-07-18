const nodemailer = require('nodemailer');
const config = require('config');
const EMAIL_HOST = config.get('EMAIL_HOST');
const EMAIL = config.get('EMAIL');
const EMAIL_PASS = config.get('EMAIL_PASS');

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST, // POP/IMAP Server
    port: 465, // SMTP Port
    secure: true, // Indicates if the connection should use SSL
    auth: {
        user: EMAIL, // Your email address
        pass: EMAIL_PASS, // Your password
    },
});

const sendHtmlEmail = async (to, subject, text, htmlTamplate, attachments) => {
    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: htmlTamplate,
        attachments: attachments,
    };
    return sendEmail(mailOptions);
};

const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html:
            `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };
    return sendEmail(mailOptions);
};

const sendReqularEmail = async (to, subject, text) => {
    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        text: text,
    };
    return sendEmail(mailOptions);
};

const sendEmail = async (mailOptions) => {
    return new Promise((resolve) => {
        // eslint-disable-next-line no-unused-vars
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Error sending email', error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
};

module.exports = {
    sendHtmlEmail,
    sendVerificationEmail,
    sendReqularEmail,
};
