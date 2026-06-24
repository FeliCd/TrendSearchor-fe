import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MousePointerClick, FolderPlus, X, Folder, Loader2, Bookmark } from 'lucide-react';
import { searchService } from '@/services/searchService';
import { bookmarkService } from '@/services/bookmarkService';
import { collectionService } from '@/services/collectionService';
import PaperPreview from '@/components/ui/PaperPreview';
import Toast from '@/components/ui/Toast';
import PageHeader from '@/components/ui/PageHeader';
import SearchHeader from '@/components/papers/SearchHeader';
import PaperResults from '@/components/papers/PaperResults';
import { useLenis } from '@/providers/LenisProvider';

export default function PaperSearchPage() {
  const { initScroller } = useLenis();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q');
  
  const resultsRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (resultsRef.current) cleanupRef.current = initScroller(resultsRef.current);
    return () => { cleanupRef.current?.(); };
  }, [initScroller]);

  const [query, setQuery] = useState(() => urlQuery || sessionStorage.getItem('ts_search_query') || '');
  const [papers, setPapers] = useState(() => {
    const saved = sessionStorage.getItem('ts_search_papers');
    return saved ? JSON.parse(saved) : [];
  });
  const [total, setTotal] = useState(() => parseInt(sessionStorage.getItem('ts_search_total') || '0', 10));
  const [page, setPage] = useState(() => parseInt(sessionStorage.getItem('ts_search_page') || '0', 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [totalPages, setTotalPages] = useState(() => parseInt(sessionStorage.getItem('ts_search_totalPages') || '0', 10));
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem('ts_search_filters');
    return saved ? JSON.parse(saved) : { yearFrom: '', yearTo: '', sortBy: 'relevance' };
  });
  const [hasSearched, setHasSearched] = useState(() => sessionStorage.getItem('ts_search_hasSearched') === 'true');
  const [toast, setToast] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(() => {
    const saved = sessionStorage.getItem('ts_search_selectedPaper');
    return saved ? JSON.parse(saved) : null;
  });

  const [collections, setCollections] = useState([]);
  const [savingToCollectionPaper, setSavingToCollectionPaper] = useState(null);
  const [savingToCollectionId, setSavingToCollectionId] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('ts_search_query', query);
    sessionStorage.setItem('ts_search_papers', JSON.stringify(papers));
    sessionStorage.setItem('ts_search_total', total.toString());
    sessionStorage.setItem('ts_search_page', page.toString());
    sessionStorage.setItem('ts_search_totalPages', totalPages.toString());
    sessionStorage.setItem('ts_search_filters', JSON.stringify(filters));
    sessionStorage.setItem('ts_search_hasSearched', hasSearched.toString());
    if (selectedPaper) sessionStorage.setItem('ts_search_selectedPaper', JSON.stringify(selectedPaper));
    else sessionStorage.removeItem('ts_search_selectedPaper');
  }, [query, papers, total, page, totalPages, filters, hasSearched, selectedPaper]);

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
      const params = {
        query: searchQuery, page: pageNum, size: 10,
        ...(filters.yearFrom && { dateFrom: `${filters.yearFrom}-01-01` }),
        ...(filters.yearTo   && { dateTo:   `${filters.yearTo}-12-31`   }),
        ...(filters.sortBy   && { sortBy:   filters.sortBy   }),
      };
      const data = await searchService.searchPapers(params);
      setPapers(data.papers || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 0); setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search papers. Please try again later.');
      setPapers([]); setTotal(0); setTotalPages(0);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      searchPapers(urlQuery, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  useEffect(() => { if (papers.length > 0) loadBookmarkedIds(papers); }, [papers, loadBookmarkedIds]);

  const handleBookmark = async (paper) => {
    if (!paper.externalId) return;
    const extId = paper.externalId;
    const isBookmarked = bookmarkedIds.has(extId);

    if (!isBookmarked) {
      handleOpenCollectionModal(paper);
      return;
    }

    setTogglingId(extId);
    setBookmarkedIds((prev) => { const next = new Set(prev); next.delete(extId); return next; });
    try {
      await bookmarkService.removePaperBookmark(extId); 
      showToast('Removed from bookmarks'); 
    } catch (err) {
      setBookmarkedIds((prev) => { const next = new Set(prev); next.add(extId); return next; });
      showToast(typeof err?.response?.data?.message === 'string' ? err.response.data.message : 'Failed to update bookmark', 'error');
    } finally { setTogglingId(null); }
  };

  const handleOpenCollectionModal = async (paper) => {
    setSavingToCollectionPaper(paper);
    try {
      const data = await collectionService.getCollections();
      setCollections(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#151515] flex flex-col h-screen overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="relative z-10 flex flex-col h-full">
        <PageHeader 
          title="Search Research Papers" 
          description="Discover academic papers, track trends, and explore research topics" 
        />
        <div className="flex-1 min-h-0 flex flex-col px-8 pt-6 pb-8 gap-4">
          <div className="flex-shrink-0">
            <SearchHeader query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} loading={loading}
              onSearch={(e) => { e.preventDefault(); searchPapers(query); }} error={error} />
          </div>
          <div className="flex-1 min-h-0 flex overflow-hidden border-2 border-gray-800">
            {/* Results pane */}
            <div className="flex-[6] bg-[#151515] border-r-2 border-gray-800 overflow-hidden flex flex-col min-w-0">
              <div ref={resultsRef} data-papersearch-results className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-thin">
                <PaperResults
                  papers={papers} loading={loading} hasSearched={hasSearched} total={total}
                  page={page} totalPages={totalPages} loadingBookmarks={loadingBookmarks}
                  bookmarkedIds={bookmarkedIds} togglingId={togglingId} selectedPaper={selectedPaper}
                  onSelect={setSelectedPaper} onBookmark={handleBookmark} onPageChange={(p) => searchPapers(query, p)} />
              </div>
            </div>
            {/* Preview pane */}
            <div className="flex-[4] bg-[#151515] overflow-hidden flex flex-col min-w-0">
              <div className="flex-1 min-h-0 flex flex-col">
                {selectedPaper ? (
                  <PaperPreview paper={selectedPaper} isBookmarked={bookmarkedIds.has(selectedPaper.externalId)}
                    isToggling={togglingId === selectedPaper.externalId} onBookmark={() => handleBookmark(selectedPaper)} onClose={() => setSelectedPaper(null)} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center h-full px-6 min-h-[400px]">
                    <div className="w-14 h-14 border-2 border-[#0058be] bg-[#0058be]/10 flex items-center justify-center mb-4">
                      <MousePointerClick className="w-6 h-6 text-[#0058be]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No paper selected</h3>
                    <p className="text-gray-500 text-sm leading-relaxed text-center">Click on a research paper from the results to preview its details here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Save to Collection Modal */}
      {savingToCollectionPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151515] border-2 border-gray-800 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#1e1e1e]">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#0058be]" /> Save to Collection
              </h3>
              <button 
                onClick={() => setSavingToCollectionPaper(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-thin p-2">
              <button
                disabled={savingToCollectionId !== null}
                onClick={async () => {
                  setSavingToCollectionId('default');
                  try {
                    await bookmarkService.addPaperBookmark(savingToCollectionPaper.externalId);
                    setBookmarkedIds(prev => new Set(prev).add(savingToCollectionPaper.externalId));
                    showToast('Added to bookmarks');
                    setSavingToCollectionPaper(null);
                  } catch (err) {
                    showToast('Failed to add bookmark', 'error');
                  } finally {
                    setSavingToCollectionId(null);
                  }
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-[#1e1e1e] transition-colors rounded-sm text-left group disabled:opacity-50 border-b border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-gray-500 group-hover:text-[#0058be]" />
                  <span className="text-sm text-gray-300 font-medium">Bookmarks (Uncategorized)</span>
                </div>
                {savingToCollectionId === 'default' && <Loader2 className="w-4 h-4 text-[#0058be] animate-spin" />}
              </button>
              {collections.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">No collections found.</p>
              ) : (
                collections.map(col => (
                  <button
                    key={col.id}
                    disabled={savingToCollectionId !== null}
                    onClick={async () => {
                      setSavingToCollectionId(col.id);
                      try {
                        let bId = null;
                        if (!bookmarkedIds.has(savingToCollectionPaper.externalId)) {
                           const res = await bookmarkService.addPaperBookmark(savingToCollectionPaper.externalId);
                           bId = res.id;
                           setBookmarkedIds(prev => new Set(prev).add(savingToCollectionPaper.externalId));
                        } else {
                           const res = await bookmarkService.addPaperBookmark(savingToCollectionPaper.externalId);
                           bId = res.id;
                        }
                        await collectionService.addBookmarkToCollection(col.id, bId);
                        showToast(`Saved to ${col.name}`);
                        setSavingToCollectionPaper(null);
                      } catch (err) {
                        console.error(err);
                        showToast('Failed to save to collection', 'error');
                      } finally {
                        setSavingToCollectionId(null);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1e1e1e] transition-colors rounded-sm text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-4 h-4 text-gray-500 group-hover:text-[#0058be]" />
                      <span className="text-sm text-gray-300 font-medium">{col.name}</span>
                    </div>
                    {savingToCollectionId === col.id && <Loader2 className="w-4 h-4 text-[#0058be] animate-spin" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
