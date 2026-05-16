import api from './api';

export const recentSearchService = {
  getRecentSearches: async (params = {}) => {
    const response = await api.get('/api/recent-searches', { params });
    return response.data;
  },

  getSuggestions: async (limit = 10) => {
    const response = await api.get('/api/recent-searches/suggestions', { params: { limit } });
    return response.data;
  },

  deleteRecentSearch: async (id) => {
    await api.delete(`/api/recent-searches/${id}`);
  },

  clearAll: async () => {
    await api.delete('/api/recent-searches');
  },
};
