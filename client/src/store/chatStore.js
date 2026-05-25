import { create } from 'zustand';
import { api } from '../lib/api.js';

const formatTime = (value) => {
  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const useChatStore = create((set) => ({
  conversations: [],
  users: [],
  activeConversationId: null,
  messagesByConversation: {},
  typingUsersByConversation: {},
  isLoadingConversations: false,
  isSearchingUsers: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });

    try {
      const { data } = await api.get('/conversations');
      const conversations = data.data.conversations.map((conversation) => ({
        ...conversation,
        lastMessage: conversation.lastMessage?.body || 'No messages yet',
        updatedAt: formatTime(conversation.lastMessage?.sentAt || conversation.updatedAt),
        online: conversation.participants.some((participant) => participant.isOnline),
        unreadCount: 0,
      }));

      set((state) => ({
        conversations,
        activeConversationId: state.activeConversationId || conversations[0]?.id || null,
        isLoadingConversations: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to load conversations',
        isLoadingConversations: false,
      });
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ users: [] });
      return;
    }

    set({ isSearchingUsers: true, error: null });

    try {
      const { data } = await api.get('/users/search', {
        params: { q: query },
      });
      set({ users: data.data.users, isSearchingUsers: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Unable to search users',
        isSearchingUsers: false,
      });
    }
  },

  startDirectConversation: async (participantId) => {
    const { data } = await api.post('/conversations/direct', { participantId });
    const conversation = {
      ...data.data.conversation,
      lastMessage: data.data.conversation.lastMessage?.body || 'No messages yet',
      updatedAt: formatTime(data.data.conversation.lastMessage?.sentAt || data.data.conversation.updatedAt),
      online: data.data.conversation.participants.some((participant) => participant.isOnline),
      unreadCount: 0,
    };

    set((state) => ({
      conversations: [
        conversation,
        ...state.conversations.filter((item) => item.id !== conversation.id),
      ],
      activeConversationId: conversation.id,
      users: [],
    }));

    return conversation;
  },

  fetchMessages: async (conversationId) => {
    if (!conversationId) return;

    const { data } = await api.get(`/messages/${conversationId}`);

    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: data.data.messages.map((message) => ({
          ...message,
          createdAt: formatTime(message.createdAt),
        })),
      },
    }));
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  addMessage: (message) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[message.conversationId] || [];

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [message.conversationId]: [
            ...conversationMessages.filter((item) => item.id !== message.tempId),
            {
              ...message,
              id: message.id || message.tempId,
              body: message.body || message.message?.body || message.message,
              createdAt:
                typeof message.createdAt === 'string' && message.createdAt.includes('T')
                  ? formatTime(message.createdAt)
                  : message.createdAt,
            },
          ],
        },
        conversations: state.conversations.map((conversation) =>
          conversation.id === message.conversationId
            ? {
                ...conversation,
                lastMessage: message.body || message.message?.body || message.message,
                updatedAt: 'now',
              }
            : conversation
        ),
      };
    });
  },

  setTypingUser: (conversationId, user, isTyping) => {
    set((state) => {
      const currentUsers = state.typingUsersByConversation[conversationId] || [];
      const nextUsers = isTyping
        ? [...currentUsers.filter((item) => item.id !== user.id), user]
        : currentUsers.filter((item) => item.id !== user.id);

      return {
        typingUsersByConversation: {
          ...state.typingUsersByConversation,
          [conversationId]: nextUsers,
        },
      };
    });
  },
}));
