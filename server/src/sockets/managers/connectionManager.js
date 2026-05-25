const userSockets = new Map();
const socketUsers = new Map();

export const connectionManager = {
  addConnection(userId, socketId) {
    const key = userId.toString();
    const sockets = userSockets.get(key) || new Set();

    sockets.add(socketId);
    userSockets.set(key, sockets);
    socketUsers.set(socketId, key);

    return sockets.size;
  },

  removeConnection(socketId) {
    const userId = socketUsers.get(socketId);

    if (!userId) {
      return null;
    }

    const sockets = userSockets.get(userId);

    if (sockets) {
      sockets.delete(socketId);

      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    }

    socketUsers.delete(socketId);

    return {
      userId,
      remainingConnections: sockets?.size || 0,
    };
  },

  getUserSocketIds(userId) {
    return Array.from(userSockets.get(userId.toString()) || []);
  },

  getUserIdBySocketId(socketId) {
    return socketUsers.get(socketId) || null;
  },

  isUserOnline(userId) {
    return this.getUserSocketIds(userId).length > 0;
  },
};
