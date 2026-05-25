import { SOCKET_EVENTS } from '../constants/events.js';
import { getConversationRoom } from '../utils/rooms.js';

const emitTypingEvent = (socket, event, conversationId) => {
  if (!conversationId) {
    socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
      event,
      message: 'conversationId is required',
    });
    return;
  }

  socket.to(getConversationRoom(conversationId)).emit(event, {
    conversationId,
    user: {
      id: socket.user._id,
      name: socket.user.name,
    },
  });
};

export const registerTypingHandlers = (_io, socket) => {
  socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId } = {}) => {
    emitTypingEvent(socket, SOCKET_EVENTS.TYPING_START, conversationId);
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId } = {}) => {
    emitTypingEvent(socket, SOCKET_EVENTS.TYPING_STOP, conversationId);
  });
};
