import api from './api';

export const searchService = {
  searchPapers: async (params) => {
    const response = await api.get('/api/papers/search', { params });
    return response.data;
  },

  getPaper: async (id) => {
    const response = await api.get(`/api/papers/${id}`);
    return response.data;
  },

  searchJournals: async (params) => {
    const response = await api.get('/api/journals/search', { params });
    return response.data;
  },

  getJournal: async (id) => {
    const response = await api.get(`/api/journals/${id}`);
    return response.data;
  },

  searchAuthors: async (params) => {
    const response = await api.get('/api/authors/search', { params });
    return response.data;
  },

  getAuthor: async (id) => {
    const response = await api.get(`/api/authors/${id}`);
    return response.data;
  },

  searchKeywords: async (params) => {
    const response = await api.get('/api/keywords/search', { params });
    return response.data;
  },

  getTopPapers: async (limit = 10) => {
    const response = await api.get('/api/top-papers', { params: { limit } });
    return response.data;
  },
};
