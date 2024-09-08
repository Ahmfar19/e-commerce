const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routers/api.router');
const apiAdminRouter = require('./routers/api.admin.router');
const { verifyEmail, isProduction } = require('./helpers/utils');
const { isAdmin, isAuthorized, initSIDSession } = require('./authentication');
const config = require('config');
const { deleteEndedDiscount } = require('./controllers/discounts.controller');
const CRYPTO_SECRET_KEY = config.get('CRYPTO_SECRET_KEY');
const { connectionOptions } = require('./databases/mysql.db');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(connectionOptions);
require('./paymentsController');
const axios = require('axios');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve('./public')));

app.get('/server/ping', (req, res) => {
    res.send('Server is active.');
});

deleteEndedDiscount();

// Apply CORS middleware with the defined options
const corsOptions = {
    origin: (origin, callback) => {
        let allowedOrigins = [];
        if (isProduction()) {
            // allowedOrigins = ['www.almondo.se', 'www.dashboard.almondo.se']; // when dist prime3
            allowedOrigins = ['misk-anbar.administreramer.se', 'dashboard.administreramer.se']; // when dist prime5
        } else {
            allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', undefined];
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(function(req, res, next) {
    if (isProduction()) {
        req.headers.origin = req.headers.host;
    }
    next();
});

app.use(cors(corsOptions));

// Global error handler to catch CORS and other errors
app.use((err, req, res, next) => {
    if (err) {
        // res.status(403).json({ error: err.message });
        return res.status(403).send('Forbidden');
    } else {
        next();
    }
});

// Session setup
app.use(session({
    store: sessionStore,
    secret: CRYPTO_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true, // Prevent JavaScript access
        sameSite: 'Lax', // Restrict cross-site
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
    },
}));

// Endpoint to proxy requests to the PostnummerService API
app.get('/server/api/postcode', async (req, res) => {
    const postcode = req.query.postcode || 50437

    if (!postcode) {
        return res.status(400).json({ error: 'Postcode is required' });
    }
    try {
        const response = await axios.get(`https://www.postnummerservice.se/umbraco/api/address/SearchAddress`, {
            params: {
                countryCode: 'se',
                postcode: postcode,
                street: '',
                locality: ''
            }
        });

        // Send the API response data to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching postcode data:', error);
        res.status(500).json({ error: 'Failed to fetch postcode data' });
    }
});

app.get('/server/api/test', (req, res) => {
    res.send('It works');
});

// Middleware to initialize user session
app.post('/server/api/auth/initSIDSession', initSIDSession);

app.use('/server/api/verify-customer', verifyEmail);

app.use('/server/api/admin', isAdmin, apiAdminRouter);
app.use('/server/api', isAuthorized, apiRouter);

module.exports = app;
