const webSocket = require('ws');
const Document = require('../db/documentSchema');
const { setupWSConnection } = require('y-websocket/bin/utils');

function setUpWebSocketServer(server) {
    const wss = new webSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        const docId = req.url.slice(1);
        console.log('connected');

        try {
            const document = await Document.findById(docId);

            if (!document) {
                ws.send(JSON.stringify({ type: 'error', message: 'Document not found' }));
                ws.close();
                return;
            }

            setupWSConnection(ws, req, docId);

            ws.on('close', async () => {
                    document.sessionId = '';
                    await document.save();
            });

        } catch (error) {
            console.error("Error setting up WebSocket connection:", error);
            ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
            ws.close();
        }
    });
}

module.exports = setUpWebSocketServer;