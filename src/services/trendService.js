import api from './api';

export const trendService = {
  // --- Existing ---
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

  // --- Phase 1: Publication Trend (MVP) ---
  /**
   * Full analysis: trend data, growth rates, status, insight, forecast.
   */
  analyzeKeyword: async (keyword, startYear, endYear) => {
    const params = {};
    if (startYear) params.startYear = startYear;
    if (endYear) params.endYear = endYear;
    const response = await api.get(`/api/trends/analyze/${encodeURIComponent(keyword)}`, { params });
    return response.data;
  },

  /**
   * Search keyword and get real-time trend from OpenAlex.
   */
  searchAndAnalyze: async (query) => {
    const response = await api.get('/api/trends/search', { params: { query } });
    return response.data;
  },

  // --- Phase 2: Trending Topics ---
  /**
   * Ranked trending topics with TrendScore, growth rate, status.
   */
  getTrendingRanking: async (limit = 20) => {
    const response = await api.get('/api/trends/ranking', { params: { limit } });
    return response.data;
  },

  /**
   * Emerging topics detection.
   */
  getEmergingTopics: async (limit = 10) => {
    const response = await api.get('/api/trends/emerging', { params: { limit } });
    return response.data;
  },

  /**
   * Full topic comparison with insight.
   */
  compareTopicsFull: async (keywords, startYear, endYear) => {
    const params = { keywords };
    if (startYear) params.startYear = startYear;
    if (endYear) params.endYear = endYear;
    const response = await api.get('/api/trends/compare-full', { params });
    return response.data;
  },

  // --- Phase 3: Keyword Relations ---
  /**
   * Keyword co-occurrence for network graph.
   */
  getRelatedKeywords: async (keyword, limit = 15) => {
    const response = await api.get('/api/trends/related', {
      params: { keyword, limit }
    });
    return response.data;
  },
};
