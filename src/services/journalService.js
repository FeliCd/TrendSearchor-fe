import api from '@/services/api';

export const journalService = {
  getJournals: async (params = {}) => {
    const res = await api.get('/api/admin/journals', { params });
    return res.data;
  },

  createJournal: async (journalData) => {
    const res = await api.post('/api/admin/journals', journalData);
    return res.data;
  },

  updateJournal: async (id, journalData) => {
    const res = await api.put(`/api/admin/journals/${id}`, journalData);
    return res.data;
  },

  deleteJournal: async (id) => {
    const res = await api.delete(`/api/admin/journals/${id}`);
    return res.data;
  },
};
