import {WebSocketServer} from 'ws';

const wss = new WebSocketServer({port: Number(process.env.WS_PORT)});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Répondre au client
    ws.send('Hello from server!');
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

export default wss;
