import api from './api';

export const leaderboardService = {
  getLeaderboard: async (limit = 5) => {
    const response = await api.get('/api/papers/leaderboard', { params: { limit } });
    return response.data;
  },
};
