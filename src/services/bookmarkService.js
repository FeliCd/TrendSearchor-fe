import api from './api';

export const bookmarkService = {
  getBookmarks: async (params = {}) => {
    const response = await api.get('/api/bookmarks', { params });
    return response.data;
  },

  addPaperBookmark: async (externalId) => {
    const response = await api.post('/api/bookmarks', { type: 'PAPER', externalId });
    return response.data;
  },

  addKeywordBookmark: async (keywordId) => {
    const response = await api.post('/api/bookmarks', { type: 'KEYWORD', keywordId });
    return response.data;
  },

  removePaperBookmark: async (externalId) => {
    await api.delete(`/api/bookmarks/paper/${encodeURIComponent(externalId)}`);
  },

  removeKeywordBookmark: async (keywordId) => {
    await api.delete(`/api/bookmarks/keyword/${keywordId}`);
  },

  removeBookmark: async (id) => {
    await api.delete(`/api/bookmarks/${id}`);
  },

  getBookmarkStats: async () => {
    const response = await api.get('/api/bookmarks/stats');
    return response.data;
  },

  checkPaperBookmark: async (externalId) => {
    const response = await api.get(`/api/bookmarks/check/paper/${encodeURIComponent(externalId)}`);
    return response.data;
  },

  checkKeywordBookmark: async (keywordId) => {
    const response = await api.get(`/api/bookmarks/check/keyword/${keywordId}`);
    return response.data;
  },
};
