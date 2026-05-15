import api from './api';

export const followService = {
  getFollows: async (params = {}) => {
    const response = await api.get('/api/follows', { params });
    return response.data;
  },

  followJournal: async (journalId) => {
    const response = await api.post('/api/follows', { type: 'JOURNAL', journalId });
    return response.data;
  },

  followTopic: async (topicId) => {
    const response = await api.post('/api/follows', { type: 'TOPIC', topicId });
    return response.data;
  },

  unfollowJournal: async (journalId) => {
    await api.delete(`/api/follows/journal/${journalId}`);
  },

  unfollowTopic: async (topicId) => {
    await api.delete(`/api/follows/topic/${topicId}`);
  },

  unfollow: async (id) => {
    await api.delete(`/api/follows/${id}`);
  },

  checkJournalFollow: async (journalId) => {
    const response = await api.get(`/api/follows/check/journal/${journalId}`);
    return response.data;
  },
};
