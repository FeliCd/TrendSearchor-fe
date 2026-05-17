import api from '@/services/api';

export const userManagementService = {
  getUsers: async (params = {}) => {
    const res = await api.get('/api/admin/users', { params });
    return res.data;
  },

  getUser: async (id) => {
    const res = await api.get(`/api/admin/users/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post('/api/admin/users', userData);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/api/admin/users/${id}`, userData);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/api/admin/users/${id}`);
    return res.data;
  },

  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/api/admin/users/${id}/status`, { status });
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await api.patch(`/api/admin/users/${id}/role`, { role });
    return res.data;
  },
};
