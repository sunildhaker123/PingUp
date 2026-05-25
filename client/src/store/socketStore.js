import { create } from 'zustand';
import { createSocket } from '../lib/socket.js';
import { useChatStore } from './chatStore.js';

export const SOCKET_EVENTS = {
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
};

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token) => {
    const existingSocket = get().socket;

    if (existingSocket?.connected) {
      return existingSocket;
    }

    const socket = createSocket(token);

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, (message) => {
      useChatStore.getState().addMessage({
        id: message.id || message.tempId || crypto.randomUUID(),
        tempId: message.tempId,
        conversationId: message.conversationId,
        senderId: message.senderId || message.sender?.id,
        senderName: message.senderName || message.sender?.name,
        body: message.message?.body || message.message || message.body,
        createdAt: message.createdAt,
      });
    });
    socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, user }) => {
      useChatStore.getState().setTypingUser(conversationId, user, true);
    });
    socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, user }) => {
      useChatStore.getState().setTypingUser(conversationId, user, false);
    });

    socket.connect();
    set({ socket });
    return socket;
  },

  disconnect: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
    }

    set({ socket: null, isConnected: false });
  },

  emit: (event, payload) => {
    const socket = get().socket;

    if (socket?.connected) {
      socket.emit(event, payload);
    }
  },
}));
