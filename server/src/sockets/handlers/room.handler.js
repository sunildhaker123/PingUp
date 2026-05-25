import { SOCKET_EVENTS } from '../constants/events.js';
import { getConversationRoom } from '../utils/rooms.js';

export const registerRoomHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.ROOM_JOIN, ({ conversationId } = {}) => {
    if (!conversationId) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        event: SOCKET_EVENTS.ROOM_JOIN,
        message: 'conversationId is required',
      });
      return;
    }

    const room = getConversationRoom(conversationId);
    socket.join(room);

    socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
      conversationId,
      socketId: socket.id,
    });
  });

  socket.on(SOCKET_EVENTS.ROOM_LEAVE, ({ conversationId } = {}) => {
    if (!conversationId) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        event: SOCKET_EVENTS.ROOM_LEAVE,
        message: 'conversationId is required',
      });
      return;
    }

    const room = getConversationRoom(conversationId);
    socket.leave(room);

    socket.emit(SOCKET_EVENTS.ROOM_LEFT, {
      conversationId,
      socketId: socket.id,
    });
  });
};
