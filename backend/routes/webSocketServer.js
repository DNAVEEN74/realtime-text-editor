const webSocket = require('ws');
const Document = require('../db/documentSchema');

function setUpWebSocketServer(server){
    const wss = new webSocket.Server({server})

wss.on('connection', async (ws, req) => {
    console.log('client connected');
    const url = new URL(req.url,`http://${req.headers.host}`);
    const docId = url.searchParams.get('docId');

    const document = await Document.findById(docId);
    const content = document.docContent;

    ws.send(JSON.stringify({
      type: 'initialContent',
      content: content
    }));
  
    ws.on('message', (message) => {
      try {
        const delta = JSON.parse(message);
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === webSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'delta',
              delta: delta
            }));
          }
        });
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    });
  
    ws.on('close', () => {
      console.log('client disconnected');
    });
  });
}

module.exports = setUpWebSocketServer ;