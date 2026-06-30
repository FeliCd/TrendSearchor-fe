import { useState, useEffect, useCallback } from 'react';
import { paperUploadService } from '@/services/paperUploadService';

/**
 * Custom hook to fetch the current researcher's uploaded papers with pagination.
 */
export function useMyUploads() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  const fetchUploads = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await paperUploadService.getMyUploads(pageIndex, PAGE_SIZE);
      setPapers(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPage(pageIndex);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load your uploads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploads(0);
  }, [fetchUploads]);

  return {
    papers,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    fetchUploads,
  };
}
