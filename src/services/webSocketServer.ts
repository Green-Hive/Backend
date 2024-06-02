import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1812936',
  key: '89316c4952f82b5e2874',
  secret: '44b53b8d24825faa49f3',
  cluster: 'eu',
  useTLS: true,
});

export default pusher;
