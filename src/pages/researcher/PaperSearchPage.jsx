import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, BookOpen, ExternalLink, Bookmark, Loader2, CheckCircle, XCircle, MousePointerClick } from 'lucide-react';
import { searchService } from '@/services/searchService';
import { bookmarkService } from '@/services/bookmarkService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import PaperPreview from '@/components/ui/PaperPreview';
import { useLenis } from '@/providers/LenisProvider';

export default function PaperSearchPage() {
  const { initScroller } = useLenis();
  const resultsRef = useRef(null);
  const cleanupRef = useRef(null);

  // Init scoped Lenis on results container — global Lenis stays intact
  useEffect(() => {
    if (resultsRef.current) {
      cleanupRef.current = initScroller(resultsRef.current);
    }
    return () => {
      cleanupRef.current?.();
    };
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
          } catch {
            // paper not in DB yet — skip
          }
        }
      }
      setBookmarkedIds(ids);
    } catch {
      // silently fail on bookmark check
    } finally {
      setLoadingBookmarks(false);
    }
  }, []);

  const searchPapers = useCallback(async (searchQuery, pageNum = 0) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setBookmarkedIds(new Set());
    setSelectedPaper(null);
    try {
      const params = {
        query: searchQuery,
        page: pageNum,
        size: 10,
        ...(filters.year && { year: filters.year }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      };
      const data = await searchService.searchPapers(params);
      setPapers(data.papers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search papers. Please try again later.');
      setPapers([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (papers.length > 0) {
      loadBookmarkedIds(papers);
    }
  }, [papers, loadBookmarkedIds]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchPapers(query);
  };

  const handleBookmark = async (paper) => {
    if (!paper.externalId) return;
    const extId = paper.externalId;
    const isCurrentlyBookmarked = bookmarkedIds.has(extId);

    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) next.delete(extId);
      else next.add(extId);
      return next;
    });
    setTogglingId(extId);

    try {
      if (isCurrentlyBookmarked) {
        await bookmarkService.removePaperBookmark(extId);
        showToast('Removed from bookmarks');
      } else {
        await bookmarkService.addPaperBookmark(extId);
        showToast('Added to bookmarks');
      }
    } catch (err) {
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) next.add(extId);
        else next.delete(extId);
        return next;
      });
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to update bookmark';
      showToast(typeof msg === 'string' ? msg : 'Failed to update bookmark', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleSelectPaper = (paper) => {
    setSelectedPaper(paper);
  };

  const handleClosePreview = () => {
    setSelectedPaper(null);
  };

  const selectedIsBookmarked = selectedPaper && bookmarkedIds.has(selectedPaper.externalId);
  const selectedIsToggling = selectedPaper && togglingId === selectedPaper.externalId;

  return (
    <div className="bg-[#010409] flex flex-col h-screen overflow-hidden">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-[slideInRight_0.3s_ease-out] ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* 7-3 Columns: full viewport height */}
      <div className="flex flex-1 min-h-0">

        {/* Column 7: Search Box (fixed top) + Results (scrollable below) */}
        <div className="flex-[7] flex flex-col min-w-0 border-r border-white/5">

          {/* Search Box: sticky at top, NO scroll */}
          <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-[#010409] border-b border-white/5">
            <h1 className="text-2xl font-bold text-white mb-1">Search Research Papers</h1>
            <p className="text-gray-400 text-sm mb-4">Discover academic papers, track trends, and explore research topics</p>
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by keyword, title, author, or topic..."
                  className="w-full pl-11 pr-4 py-3 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm"
                />
              </div>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
                placeholder="Year"
                className="w-24 px-3 py-3 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm text-center"
              />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                className="px-3 py-3 bg-[#161b22] border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="citationCount">Citations</option>
                <option value="year">Year</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </form>
            {error && <div className="mt-3"><Alert type="error" message={error} /></div>}
          </div>

          {/* Results: scrollable, fills remaining height */}
          <div ref={resultsRef} data-papersearch-results className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-thin">
            {papers.length > 0 && (
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <div className="text-gray-400 text-sm">
                  Found <span className="text-white font-semibold">{total.toLocaleString()}</span> results
                </div>
                {loadingBookmarks && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Checking bookmarks...
                  </div>
                )}
              </div>
            )}

            <div className="px-6 pb-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : hasSearched && papers.length === 0 && !error ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No papers found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your search query or filters</p>
                </div>
              ) : !hasSearched ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Start searching</h3>
                  <p className="text-gray-400 text-sm">Enter a keyword to discover research papers</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {papers.map((paper) => {
                    const isBookmarked = bookmarkedIds.has(paper.externalId);
                    const isToggling = togglingId === paper.externalId;
                    const isSelected = selectedPaper?.externalId === paper.externalId;
                    return (
                      <div
                        key={paper.externalId}
                        onClick={() => handleSelectPaper(paper)}
                        className={`bg-[#161b22] border rounded-xl p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#4A90E2]/60 shadow-[0_0_0_1px_#4A90E2/40]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1.5">
                              <MousePointerClick className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${isSelected ? 'text-[#4A90E2]' : 'text-gray-600'}`} />
                              <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">
                                {paper.title}
                              </h3>
                            </div>

                            {paper.abstract && (
                              <p className="text-gray-400 text-sm mb-2.5 line-clamp-2 ml-5">
                                {paper.abstract}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs ml-5">
                              {paper.year && (
                                <span className="px-2 py-0.5 bg-[#0d1117] text-gray-300 rounded">
                                  {paper.year}
                                </span>
                              )}
                              {paper.citationCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#0d1117] text-[#4A90E2] rounded">
                                  {paper.citationCount} citations
                                </span>
                              )}
                              {paper.openAccess && (
                                <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded">
                                  Open Access
                                </span>
                              )}
                              {paper.authors?.length > 0 && (
                                <span className="text-gray-400">
                                  {paper.authors.slice(0, 3).map(a => a.name).join(', ')}
                                  {paper.authors.length > 3 && ' et al.'}
                                </span>
                              )}
                            </div>

                            {paper.keywords?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5 ml-5">
                                {paper.keywords.slice(0, 5).map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {paper.paperUri && (
                              <a
                                href={paper.paperUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookmark(paper);
                              }}
                              disabled={isToggling || !paper.externalId}
                              className={`p-1.5 border rounded-lg transition-all disabled:opacity-50 ${
                                isBookmarked
                                  ? 'bg-[#4A90E2]/20 border-[#4A90E2] text-[#4A90E2]'
                                  : 'bg-[#0d1117] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                              }`}
                              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4 pb-2">
                      <button
                        onClick={() => searchPapers(query, page - 1)}
                        disabled={page === 0}
                        className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors text-sm"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-400 text-sm">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => searchPapers(query, page + 1)}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors text-sm"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Preview Panel (100vh, no scroll) */}
        <div className="flex-[3] flex flex-col min-w-0 bg-[#010409] px-6 py-4 overflow-hidden">
          <div className="flex-1 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            {selectedPaper ? (
              <PaperPreview
                paper={selectedPaper}
                isBookmarked={selectedIsBookmarked}
                isToggling={selectedIsToggling}
                onBookmark={() => handleBookmark(selectedPaper)}
                onClose={handleClosePreview}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 flex items-center justify-center mb-4">
                  <MousePointerClick className="w-7 h-7 text-[#4A90E2]/50" />
                </div>
                <h3 className="text-white font-medium mb-2">No paper selected</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-center">
                  Click on a research paper from the results to preview its details here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
