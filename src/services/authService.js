import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  requestPasswordReset: async (emailOrUsername) => {
    const response = await api.post('/auth/forgot-password', { emailOrUsername });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
