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

const sendVerificationEmail = async (email, template) => {
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Verify Your Email Address',
        html: template,
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
