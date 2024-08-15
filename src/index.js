const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');
const WebSocketManager = require('./websocketManager');
const WebSocket = require('ws');

const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const isDevelopment = NODE_ENV === 'development';

const config = require('config');
const PORT = isDevelopment ? 4000 : config.get('PORT');

// Create an HTTP server with the Express app
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const websocketManager = new WebSocketManager(wss);
app.wsManager = websocketManager;

server.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`);
});

module.exports = server;
