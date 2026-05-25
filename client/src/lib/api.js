import axios from 'axios';

const getPersistedToken = () => {
  const storedAuth = window.localStorage.getItem('chat-auth');

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth).state?.token || null;
  } catch {
    return null;
  }
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getPersistedToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('chat-auth');
    }

    return Promise.reject(error);
  }
);
