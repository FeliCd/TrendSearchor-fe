import { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, ExternalLink, Bookmark, ChevronDown, Filter, Loader2 } from 'lucide-react';
import { searchService } from '@/services/searchService';
import { bookmarkService } from '@/services/bookmarkService';
import StatCard from '@/components/ui/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function PaperSearchPage() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ year: '', sortBy: 'relevance' });
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPapers = useCallback(async (searchQuery, pageNum = 0) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
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

  const handleSearch = (e) => {
    e.preventDefault();
    searchPapers(query);
  };

  const handleBookmark = async (paper) => {
    if (bookmarkedIds.has(paper.externalId)) {
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(paper.externalId);
        return next;
      });
    } else {
      setBookmarkedIds(prev => new Set([...prev, paper.externalId]));
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Research Papers</h1>
          <p className="text-gray-400">Discover academic papers, track trends, and explore research topics</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, title, author, or topic..."
              className="w-full pl-12 pr-32 py-4 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="mt-3 p-4 bg-[#161b22] border border-white/10 rounded-xl flex gap-4 flex-wrap">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Year</label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2024"
                  className="px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white text-sm w-32"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                  className="px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="citationCount">Citations</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>
          )}
        </form>

        {/* Results */}
        {error && <Alert type="error" message={error} />}

        {papers.length > 0 && (
          <div className="mb-4 text-gray-400 text-sm">
            Found <span className="text-white font-semibold">{total.toLocaleString()}</span> results
          </div>
        )}

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
        ) : hasSearched && error ? (
          <div className="text-center py-12">
            <Alert type="error" message={error} />
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Start searching</h3>
            <p className="text-gray-400 text-sm">Enter a keyword to discover research papers</p>
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <div key={paper.paperId || paper.externalId} className="bg-[#161b22] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                      {paper.title}
                    </h3>

                    {paper.abstract && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                        {paper.abstract}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {paper.year && (
                        <span className="px-2 py-1 bg-[#0d1117] text-gray-300 rounded">
                          {paper.year}
                        </span>
                      )}
                      {paper.citationCount > 0 && (
                        <span className="px-2 py-1 bg-[#0d1117] text-[#4A90E2] rounded">
                          {paper.citationCount} citations
                        </span>
                      )}
                      {paper.openAccess && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded">
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        {paper.keywords.slice(0, 5).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {paper.paperUri && (
                      <a
                        href={paper.paperUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleBookmark(paper)}
                      className={`p-2 border rounded-lg transition-colors ${
                        bookmarkedIds.has(paper.externalId)
                          ? 'bg-[#4A90E2]/20 border-[#4A90E2] text-[#4A90E2]'
                          : 'bg-[#0d1117] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => searchPapers(query, page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => searchPapers(query, page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
