import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://lije-care-api-dev.zikollab.com', {
  transports: ['websocket'],
});

export default socket;
