import api from '@/services/api';

export const paperUploadService = {
  /**
   * POST /api/papers/upload
   * Upload a new research paper (RESEARCHER & ADMIN only).
   * @param {Object} payload - { title, abstractText, year, paperUri, authors[], journals[], keywords[], license, publicationType, ownershipConfirmed, termsAccepted, embargoUntil }
   */
  uploadPaper: async (payload) => {
    const res = await api.post('/api/papers/upload', payload);
    return res.data;
  },

  /**
   * PUT /api/papers/{id}/resubmit
   * Resubmit a rejected research paper with updated data (RESEARCHER only).
   * @param {number|string} id - Paper ID
   * @param {Object} payload - { title, abstractText, year, paperUri, authors[], journals[], keywords[], license, publicationType, ownershipConfirmed, termsAccepted, embargoUntil }
   */
  resubmitPaper: async (id, payload) => {
    const res = await api.put(`/api/papers/${id}/resubmit`, payload);
    return res.data;
  },

  /**
   * POST /api/papers/{id}/copyright-report
   * Submit a copyright violation report for a paper.
   * @param {number|string} paperId - Paper ID
   * @param {Object} payload - { reason: string }
   */
  reportCopyright: async (paperId, payload) => {
    const res = await api.post(`/api/papers/${paperId}/copyright-report`, payload);
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
  getPendingPapers: async (page = 0, size = 10, search = '') => {
    const res = await api.get('/api/admin/papers/pending', { params: { page, size, search } });
    return res.data;
  },

  /**
   * GET /api/admin/papers/history
   * Fetch paginated list of papers moderated (approved/rejected) (ADMIN only).
   */
  getModerationHistory: async (page = 0, size = 10, search = '', status = 'ALL') => {
    const res = await api.get('/api/admin/papers/history', { params: { page, size, search, status } });
    return res.data;
  },

  /**
   * POST /api/admin/papers/{id}/revoke
   * Revoke a decision made on a paper (revert back to PENDING) (ADMIN only).
   */
  revokePaper: async (id, payload) => {
    const res = await api.post(`/api/admin/papers/${id}/revoke`, payload);
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
