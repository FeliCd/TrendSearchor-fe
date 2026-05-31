import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/api/auth/change-password', passwordData);
    return response.data;
  },

  changeRole: async (newRole) => {
    const response = await api.post('/api/profile/change-role', { role: newRole }, { timeout: 5000 });
    return response.data;
  },
};
