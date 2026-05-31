import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data;
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  requestPasswordReset: async (emailOrUsername) => {
    const response = await api.post('/api/auth/forgot-password', { emailOrUsername });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};
