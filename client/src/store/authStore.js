import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api.js';

const getApiErrorMessage = (error, fallback) => {
  const response = error.response?.data;
  const details = response?.details;

  if (Array.isArray(details) && details.length > 0) {
    return details.map((detail) => detail.message).join(', ');
  }

  return response?.message || error.message || fallback;
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', payload);
          set({ user: data.data.user, token: data.data.token, isLoading: false });
          return data.data;
        } catch (error) {
          const message = getApiErrorMessage(error, 'Registration failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', payload);
          set({ user: data.data.user, token: data.data.token, isLoading: false });
          return data.data;
        } catch (error) {
          const message = getApiErrorMessage(error, 'Login failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },
    }),
    {
      name: 'chat-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
