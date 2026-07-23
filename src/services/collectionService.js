import api from './api';

export const collectionService = {
  getCollections: async () => {
    const response = await api.get('/api/collections');
    return response.data;
  },

  createCollection: async (name, description = '') => {
    const response = await api.post('/api/collections', { name, description });
    return response.data;
  },

  updateCollection: async (id, name, description = '') => {
    const response = await api.put(`/api/collections/${id}`, { name, description });
    return response.data;
  },

  deleteCollection: async (id) => {
    const response = await api.delete(`/api/collections/${id}`);
    return response.data;
  },

  addBookmarkToCollection: async (collectionId, bookmarkId) => {
    const response = await api.post(`/api/collections/${collectionId}/bookmarks/${bookmarkId}`);
    return response.data;
  },

  removeBookmarkFromCollection: async (collectionId, bookmarkId) => {
    const response = await api.delete(`/api/collections/${collectionId}/bookmarks/${bookmarkId}`);
    return response.data;
  }
};
