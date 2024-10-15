const webSocket = require('ws');
const Document = require('../db/documentSchema');
const { setupWSConnection } = require('y-websocket/bin/utils');
const Y = require('yjs');

const yDocuments = new Map();

function setUpWebSocketServer(server){
    const wss = new webSocket.Server({server})

    wss.on('connection', async (ws, req) => {
      const docId = req.url.slice(1);
  
      try {
          const document = await Document.findById(docId);
          if (!document) {
              ws.send(JSON.stringify({ type: 'error', message: 'Document not found' }));
              ws.close();
              return;
          }

          let ydoc = yDocuments.get(docId);
            if (!ydoc) {
                ydoc = new Y.Doc();
                yDocuments.set(docId, ydoc);
            }

            setupWSConnection(ws, req, { docId, ydoc });

            ws.on('close', async () => {
              ydoc.destroy();
              yDocuments.delete(docId);

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

module.exports = setUpWebSocketServer ;