import { io } from 'socket.io-client';

export const createSocket = (token) =>
  io(import.meta.env.VITE_SOCKET_URL || 'https://pingup-122p.onrender.com', {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
  });
