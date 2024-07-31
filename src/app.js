const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routers/api.router');
const apiAdminRouter = require('./routers/api.admin.router');
const { verifyEmail } = require('./helpers/utils');
const { isAdmin, isAuthorized, initSIDSession } = require('./authentication');
const config = require('config');
const CRYPTO_SECRET_KEY = config.get('CRYPTO_SECRET_KEY');
require('./databases/mysql.db');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve('./public')));

// Apply CORS middleware with the defined options
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['https://administreramer.se', 'http://localhost:3000'];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));

// Global error handler to catch CORS and other errors
app.use((err, req, res, next) => {
    if (err) {
        // res.status(403).json({ error: err.message });
        return res.status(403).send("Forbidden");
    } else {
        next();
    }
});

// Session setup
app.use(session({
    secret: CRYPTO_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // Prevent JavaScript access
        sameSite: 'Lax', // Restrict cross-site
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
    },
}));

// Middleware to initialize user session
app.post('/server/api/auth/initSIDSession', initSIDSession);

app.use('/api/verify-email', verifyEmail);

app.use('/server/api/admin', isAdmin, apiAdminRouter);
app.use('/server/api', isAuthorized, apiRouter);

module.exports = app;
