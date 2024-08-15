const WebSocket = require('ws');

class WebSocketManager {
    constructor(wss) {
        this.wss = wss;
        this.clients = new Map(); // To store clients with a unique identifier
        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            console.log('New WebSocket connection');
            let clientId = null;

            ws.on('message', (message) => {
                try {
                    const msg = JSON.parse(message);

                    if (msg.type === 'id' && msg.id) {
                        clientId = msg.id;
                        this.clients.set(clientId, ws);
                        console.log(`Client registered with ID: ${clientId}`);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('close', () => {
                console.log('WebSocket disconnected');
                if (clientId) {
                    this.clients.delete(clientId);
                    // console.log(`Client ${clientId} removed`);
                }
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });

        this.wss.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    }

    sendMessageToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log(`Message sent to client ${clientId}: ${message}`);
        } else {
            console.log(`Client ${clientId} not found or not connected`);
        }
    }
}

module.exports = WebSocketManager;
