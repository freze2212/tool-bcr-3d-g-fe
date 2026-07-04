import { io, Socket } from 'socket.io-client';

const LOCAL_SOCKET = 'http://localhost:4000';
const url = process.env.REACT_APP_SOCKET_URL || (process.env.NODE_ENV === 'development' ? LOCAL_SOCKET : undefined);

export const socket: Socket = io(url || '/', {
  transports: ['websocket'],
  autoConnect: true,
});
