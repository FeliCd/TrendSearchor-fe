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
};
