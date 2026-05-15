import api from './api';

export const dashboardService = {
  getPublicDashboard: async () => {
    const response = await api.get('/api/dashboard/public');
    return response.data;
  },

  getUserDashboard: async () => {
    const response = await api.get('/api/dashboard/me');
    return response.data;
  },

  getActivityStats: async () => {
    const response = await api.get('/api/dashboard/activity');
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get('/api/dashboard/admin/stats');
    return response.data;
  },
};
