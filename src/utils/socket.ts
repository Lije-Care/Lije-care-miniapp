import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://68.183.216.158:1020', {
  transports: ['websocket'],
});

export default socket;
