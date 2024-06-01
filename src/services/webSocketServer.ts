import {WebSocketServer} from 'ws';

const wss = new WebSocketServer({port: Number(process.env.WS_PORT)});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('close', () => {
    console.log('WebSocket client connected');
  });
});

export default wss;
