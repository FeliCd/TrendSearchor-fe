import api from './api';

export const topicService = {
  searchTopics: async (query) => {
    try {
      const response = await api.get('/api/topics/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching topics:', error);
      return [];
    }
  },

  getTopics: async (params = {}) => {
    const res = await api.get('/api/admin/topics', { params });
    return res.data;
  },

  createTopic: async (topicData) => {
    const res = await api.post('/api/admin/topics', topicData);
    return res.data;
  },

  updateTopic: async (id, topicData) => {
    const res = await api.put(`/api/admin/topics/${id}`, topicData);
    return res.data;
  },

  deleteTopic: async (id) => {
    const res = await api.delete(`/api/admin/topics/${id}`);
    return res.data;
  },
};
