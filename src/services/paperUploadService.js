import api from '@/services/api';

export const paperUploadService = {
  /**
   * POST /api/papers/upload
   * Upload a new research paper (RESEARCHER & ADMIN only).
   * @param {Object} payload - { title, abstractText, year, paperUri, authors[], journals[], keywords[] }
   */
  uploadPaper: async (payload) => {
    const res = await api.post('/api/papers/upload', payload);
    return res.data;
  },

  /**
   * GET /api/papers/my-uploads
   * Fetch paginated list of papers uploaded by the current user.
   */
  getMyUploads: async (page = 0, size = 10) => {
    const res = await api.get('/api/papers/my-uploads', { params: { page, size } });
    return res.data;
  },

  /**
   * GET /api/admin/papers/pending
   * Fetch paginated list of papers awaiting moderation (ADMIN only).
   */
  getPendingPapers: async (page = 0, size = 10) => {
    const res = await api.get('/api/admin/papers/pending', { params: { page, size } });
    return res.data;
  },

  /**
   * POST /api/admin/papers/{id}/approve
   * Approve or reject a paper with optional feedback comments (ADMIN only).
   * @param {number|string} id - Paper ID
   * @param {Object} payload - { status: 'APPROVED'|'REJECTED', comments: string }
   */
  reviewPaper: async (id, payload) => {
    const res = await api.post(`/api/admin/papers/${id}/approve`, payload);
    return res.data;
  },
};
