const dotenv = require('dotenv');
const http = require('http');
const https = require('https');
const app = require('./app');
const WebSocketManager = require('./websocketManager');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isHttps = process.env.HTTPS ? true : false;


if (NODE_ENV === 'development') dotenv.config();

const isDevelopment = NODE_ENV === 'development';

const config = require('config');
const PORT = isDevelopment ? 4000 : config.get('PORT');

// Create an HTTP server with the Express app
// const server = http.createServer(app);
let server = http.createServer(app);

if (isHttps) {
    // Läs SSL-certifikatet och nyckeln
    const key = fs.readFileSync(path.join(__dirname, '/ssl/node/key.pem'), 'utf8');
    const cert = fs.readFileSync(path.join(__dirname, '/ssl/node/cert.pem'), 'utf8');
    const options = { key: key, cert: cert };
    server = https.createServer(options, app);
}

const wss = new WebSocket.Server({ server });

const websocketManager = new WebSocketManager(wss);
app.wsManager = websocketManager;

server.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`);
});

module.exports = server;
