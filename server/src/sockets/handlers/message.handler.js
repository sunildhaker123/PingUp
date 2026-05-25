import { SOCKET_EVENTS } from '../constants/events.js';
import { getConversationRoom } from '../utils/rooms.js';
import { createMessage } from '../../services/message.service.js';

export const registerMessageHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ conversationId, message, tempId } = {}) => {
    if (!conversationId || !message?.body) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        event: SOCKET_EVENTS.MESSAGE_SEND,
        message: 'conversationId and message are required',
      });
      return;
    }

    try {
      const savedMessage = await createMessage({
        conversationId,
        senderId: socket.user._id,
        body: message.body,
        attachments: message.attachments || [],
      });

      io.to(getConversationRoom(conversationId)).emit(SOCKET_EVENTS.MESSAGE_NEW, {
        ...savedMessage,
        tempId,
      });
    } catch (error) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        event: SOCKET_EVENTS.MESSAGE_SEND,
        message: error.message || 'Unable to send message',
      });
    }
  });

  socket.on(SOCKET_EVENTS.MESSAGE_BROADCAST, ({ message } = {}) => {
    if (!message) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
        event: SOCKET_EVENTS.MESSAGE_BROADCAST,
        message: 'message is required',
      });
      return;
    }

    socket.broadcast.emit(SOCKET_EVENTS.MESSAGE_BROADCAST, {
      message,
      senderId: socket.user._id,
      createdAt: new Date().toISOString(),
    });
  });
};
