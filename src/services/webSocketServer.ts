import {WebSocketServer} from 'ws';

// const wss = new WebSocketServer({port: Number(process.env.WS_PORT)});
//
// wss.on('connection', (ws) => {
//   console.log('WebSocket client connected');
//
//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//     // Répondre au client
//     ws.send('Hello from server!');
//   });
//
//   ws.on('close', () => {
//     console.log('WebSocket client disconnected');
//   });
// });

// export default wss;

import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1812936',
  key: '89316c4952f82b5e2874',
  secret: '44b53b8d24825faa49f3',
  cluster: 'eu',
  useTLS: true,
});

export default pusher;
