import api from './api';

export const trendService = {
  getTrendingKeywords: async (limit = 20) => {
    const response = await api.get('/api/trends/keywords', { params: { limit } });
    return response.data;
  },

  getKeywordTrend: async (keyword, startYear) => {
    const params = {};
    if (startYear) params.startYear = startYear;
    const response = await api.get(`/api/trends/keyword/${encodeURIComponent(keyword)}`, { params });
    return response.data;
  },

  compareTrends: async (keywords) => {
    const response = await api.get('/api/trends/compare', { params: { keywords } });
    return response.data;
  },

  getTopKeywords: async (limit = 10) => {
    const response = await api.get('/api/trends/top-keywords', { params: { limit } });
    return response.data;
  },

  getYearlyStats: async () => {
    const response = await api.get('/api/trends/yearly');
    return response.data;
  },
};
