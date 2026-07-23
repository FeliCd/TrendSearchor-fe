import api from './api';

export const noteService = {
  getNote: async (externalId) => {
    const response = await api.get(`/api/notes/${externalId}`);
    return response.data;
  },

  saveNote: async (externalId, content) => {
    const response = await api.put(`/api/notes/${externalId}`, { content });
    return response.data;
  },

  deleteNote: async (externalId) => {
    const response = await api.delete(`/api/notes/${externalId}`);
    return response.data;
  }
};
