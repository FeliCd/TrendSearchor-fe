import api from './api';

export const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  getUnreadNotifications: async (params = {}) => {
    const response = await api.get('/api/notifications/unread', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/unread/count');
    return response.data;
  },

  getRecentNotifications: async (limit = 5) => {
    const response = await api.get('/api/notifications/recent', { params: { limit } });
    return response.data;
  },

  markAsRead: async (id) => {
    await api.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/api/notifications/read-all');
  },
};
