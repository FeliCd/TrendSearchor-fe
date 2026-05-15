import api from './api';

export const bookmarkService = {
  getBookmarks: async (params = {}) => {
    const response = await api.get('/api/bookmarks', { params });
    return response.data;
  },

  addPaperBookmark: async (paperId) => {
    const response = await api.post('/api/bookmarks', { type: 'PAPER', paperId });
    return response.data;
  },

  addKeywordBookmark: async (keywordId) => {
    const response = await api.post('/api/bookmarks', { type: 'KEYWORD', keywordId });
    return response.data;
  },

  removePaperBookmark: async (paperId) => {
    await api.delete(`/api/bookmarks/paper/${paperId}`);
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

  checkPaperBookmark: async (paperId) => {
    const response = await api.get(`/api/bookmarks/check/paper/${paperId}`);
    return response.data;
  },
};
