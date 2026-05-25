import { User } from '../../models/User.js';
import { SOCKET_EVENTS } from '../constants/events.js';
import { connectionManager } from '../managers/connectionManager.js';
import { getUserRoom } from '../utils/rooms.js';
import { registerMessageHandlers } from './message.handler.js';
import { registerRoomHandlers } from './room.handler.js';
import { registerTypingHandlers } from './typing.handler.js';

const markUserOnline = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeenAt: null,
  });
};

const markUserOffline = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    isOnline: false,
    lastSeenAt: new Date(),
  });
};

export const handleConnection = async (io, socket) => {
  const userId = socket.user._id.toString();
  const activeConnections = connectionManager.addConnection(userId, socket.id);

  socket.join(getUserRoom(userId));

  if (activeConnections === 1) {
    await markUserOnline(userId);
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
      userId,
      connectedAt: new Date().toISOString(),
    });
  }

  registerRoomHandlers(io, socket);
  registerMessageHandlers(io, socket);
  registerTypingHandlers(io, socket);

  socket.on(SOCKET_EVENTS.DISCONNECT, async (reason) => {
    const connection = connectionManager.removeConnection(socket.id);

    if (!connection || connection.remainingConnections > 0) {
      return;
    }

    await markUserOffline(connection.userId);
    socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
      userId: connection.userId,
      reason,
      disconnectedAt: new Date().toISOString(),
    });
  });
};
