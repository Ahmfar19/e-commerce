const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const path = require('path');
const User = require('./models/customer.model');
require('./databases/mysql.db');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve('./public')));
// const NODE_ENV = process.env.NODE_ENV || 'development';
// const whitelist = [];
// const corsOptions = {
//     origin: function (origin = '', callback) {
//         if (whitelist.indexOf(origin) !== -1) callback(null, true);
//         else callback(new Error('Not allowed by CORS'));
//     },
//     methods: ['GET, POST'],
//     allowedHeaders: ['Content-Type'],
// };

// app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

// This one or the above one
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors());

app.use('/api/verify-email', async (req, res, next) => {
    const { token } = req.query;

    try {
        const user = await User.findByVerificationToken(token);

        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        if (user.tokenExpiryDate < Date.now()) {
            return res.status(400).send('Token has expired.');
        }

        user[0].registered = true;
        user[0].verificationToken = undefined;
        user[0].tokenExpiryDate = undefined;

        const newuser = new User(user[0]);
        await newuser.updateUser(user[0].customer_id);

        res.redirect('/login'); // تحويل المستخدم إلى صفحة تسجيل الدخول
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => res.send('It, works!'));
// app.use('/api', apiRouter);
app.use('/server/api', apiRouter);

module.exports = app;
