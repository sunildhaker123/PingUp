import { Server } from 'socket.io';
import { corsOptions } from '../config/cors.js';
import { SOCKET_EVENTS } from './constants/events.js';
import { handleConnection } from './handlers/connection.handler.js';
import { socketAuth } from './socketAuth.js';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: corsOptions,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuth);

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    handleConnection(io, socket).catch((error) => {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        message: 'Failed to initialize socket connection',
      });
      socket.disconnect(true);
      console.error(error);
    });
  });

  return io;
};
