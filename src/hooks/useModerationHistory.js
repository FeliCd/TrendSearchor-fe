import { useState, useEffect, useCallback } from 'react';
import { paperUploadService } from '@/services/paperUploadService';

/**
 * Custom hook to fetch the list of moderated papers history (Admin/Moderator only).
 */
export function useModerationHistory() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const fetchHistory = useCallback(async (pageIndex = 0, searchVal = '', statusVal = 'ALL') => {
    setLoading(true);
    setError('');
    try {
      const data = await paperUploadService.getModerationHistory(pageIndex, PAGE_SIZE, searchVal, statusVal);
      setPapers(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPage(pageIndex);
      setSearch(searchVal);
      setStatus(statusVal);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load moderation history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(0, '', 'ALL');
  }, [fetchHistory]);

  return {
    papers,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    search,
    status,
    fetchHistory,
    setPapers,
  };
}
