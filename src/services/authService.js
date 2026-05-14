import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
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
      window.location.href = '/login';
    }
  },

  requestPasswordReset: async (emailOrUsername) => {
    const response = await api.post('/api/auth/forgot-password', { emailOrUsername });
    return response.data;
  },
};
