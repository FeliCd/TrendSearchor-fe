import { useState, useEffect, useCallback, useRef } from 'react';
import { MousePointerClick } from 'lucide-react';
import { searchService } from '@/services/searchService';
import { bookmarkService } from '@/services/bookmarkService';
import PaperPreview from '@/components/ui/PaperPreview';
import Toast from '@/components/ui/Toast';
import SearchHeader from '@/components/papers/SearchHeader';
import PaperResults from '@/components/papers/PaperResults';
import { useLenis } from '@/providers/LenisProvider';

export default function PaperSearchPage() {
  const { initScroller } = useLenis();
  const resultsRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (resultsRef.current) cleanupRef.current = initScroller(resultsRef.current);
    return () => { cleanupRef.current?.(); };
  }, [initScroller]);

  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ year: '', sortBy: 'relevance' });
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadBookmarkedIds = useCallback(async (paperList) => {
    if (!paperList.length) return;
    setLoadingBookmarks(true);
    try {
      const ids = new Set();
      for (const paper of paperList) {
        if (paper.externalId) {
          try {
            const result = await bookmarkService.checkPaperBookmark(paper.externalId);
            if (result.isBookmarked) ids.add(paper.externalId);
          } catch { /* skip */ }
        }
      }
      setBookmarkedIds(ids);
    } catch { /* silent */ }
    finally { setLoadingBookmarks(false); }
  }, []);

  const searchPapers = useCallback(async (searchQuery, pageNum = 0) => {
    if (!searchQuery.trim()) return;
    setLoading(true); setError(null); setHasSearched(true); setBookmarkedIds(new Set()); setSelectedPaper(null);
    try {
      const params = { query: searchQuery, page: pageNum, size: 10, ...(filters.year && { year: filters.year }), ...(filters.sortBy && { sortBy: filters.sortBy }) };
      const data = await searchService.searchPapers(params);
      setPapers(data.papers || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 0); setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search papers. Please try again later.');
      setPapers([]); setTotal(0); setTotalPages(0);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { if (papers.length > 0) loadBookmarkedIds(papers); }, [papers, loadBookmarkedIds]);

  const handleBookmark = async (paper) => {
    if (!paper.externalId) return;
    const extId = paper.externalId;
    const isBookmarked = bookmarkedIds.has(extId);
    setBookmarkedIds((prev) => { const next = new Set(prev); isBookmarked ? next.delete(extId) : next.add(extId); return next; });
    setTogglingId(extId);
    try {
      if (isBookmarked) { await bookmarkService.removePaperBookmark(extId); showToast('Removed from bookmarks'); }
      else { await bookmarkService.addPaperBookmark(extId); showToast('Added to bookmarks'); }
    } catch (err) {
      setBookmarkedIds((prev) => { const next = new Set(prev); isBookmarked ? next.add(extId) : next.delete(extId); return next; });
      showToast(typeof err?.response?.data?.message === 'string' ? err.response.data.message : 'Failed to update bookmark', 'error');
    } finally { setTogglingId(null); }
  };

  return (
    <div className="bg-[#151515] flex flex-col h-screen overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="flex flex-1 min-h-0">
        <div className="flex-[7] flex flex-col min-w-0 border-r border-white/5">
          <SearchHeader query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} loading={loading}
            onSearch={(e) => { e.preventDefault(); searchPapers(query); }} error={error} />
          <div ref={resultsRef} data-papersearch-results className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-thin">
            <PaperResults
              papers={papers} loading={loading} hasSearched={hasSearched} total={total}
              page={page} totalPages={totalPages} loadingBookmarks={loadingBookmarks}
              bookmarkedIds={bookmarkedIds} togglingId={togglingId} selectedPaper={selectedPaper}
              onSelect={setSelectedPaper} onBookmark={handleBookmark} onPageChange={(p) => searchPapers(query, p)} />
          </div>
        </div>
        <div className="flex-[3] flex flex-col min-w-0 bg-[#010409] px-6 py-4 overflow-hidden">
          <div className="flex-1 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            {selectedPaper ? (
              <PaperPreview paper={selectedPaper} isBookmarked={bookmarkedIds.has(selectedPaper.externalId)}
                isToggling={togglingId === selectedPaper.externalId} onBookmark={() => handleBookmark(selectedPaper)} onClose={() => setSelectedPaper(null)} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0058be]/10 flex items-center justify-center mb-4">
                  <MousePointerClick className="w-7 h-7 text-[#0058be]/50" />
                </div>
                <h3 className="text-white font-medium mb-2">No paper selected</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-center">Click on a research paper from the results to preview its details here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
