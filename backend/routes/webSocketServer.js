const webSocket = require('ws');

function setUpWebSocketServer(server){
    const wss = new webSocket.Server({server})

wss.on('connection', (ws) => {
    console.log('client connected');
  
    ws.on('message', (message) => {
      try {
        const delta = JSON.parse(message);
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === webSocket.OPEN) {
            client.send(JSON.stringify(delta));
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