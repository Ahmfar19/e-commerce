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
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 80 });

const app = express();
deleteEndedDiscount();
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve('./public')));

// WebSocket event handling
// wss.on('connection', (ws) => {
//     console.log('A new client connected.');

//     // Event listener for incoming messages
//     ws.on('message', (message) => {
//       console.log('Received message:', message.toString());

//       // Broadcast the message to all connected clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(message.toString());
//         }
//       });
//     });

//     // Event listener for client disconnection
//     ws.on('close', () => {
//       console.log('A client disconnected.');
//     });
//   });

// Apply CORS middleware with the defined options
const corsOptions = {
    origin: (origin, callback) => {
        let allowedOrigins = [];
        if (isProduction()) {
            allowedOrigins = ['misk-anbar.administreramer.se', 'dashboard.administreramer.se'];
        } else {
            allowedOrigins = ['http://localhost:3000'];
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // In development, allow any origin
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
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

// Middleware to initialize user session
app.post('/server/api/auth/initSIDSession', initSIDSession);

app.use('/server/api/verify-customer', verifyEmail);

app.use('/server/api/admin', isAdmin, apiAdminRouter);
app.use('/server/api', isAuthorized, apiRouter);

module.exports = app;
