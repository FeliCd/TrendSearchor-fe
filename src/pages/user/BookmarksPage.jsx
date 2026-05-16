import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Trash2, Loader2, BookOpen, Tag, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { bookmarkService } from '@/services/bookmarkService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (filter !== 'ALL') params.type = filter;
      const data = await bookmarkService.getBookmarks(params);
      setBookmarks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      showToast('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemove = async (bookmark) => {
    const prev = [...bookmarks];
    setBookmarks(bookmarks.filter(b => b.id !== bookmark.id));
    try {
      if (bookmark.paper?.externalId) {
        await bookmarkService.removePaperBookmark(bookmark.paper.externalId);
      } else if (bookmark.keyword?.id) {
        await bookmarkService.removeKeywordBookmark(bookmark.keyword.id);
      } else {
        await bookmarkService.removeBookmark(bookmark.id);
      }
      showToast('Bookmark removed');
    } catch (err) {
      setBookmarks(prev);
      showToast('Failed to remove bookmark', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#010409]">
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-[slideInRight_0.3s_ease-out] ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Bookmarks</h1>
            <p className="text-gray-400 text-sm">Your saved papers and keywords for quick access</p>
          </div>
          <Bookmark className="w-10 h-10 text-[#4A90E2]" />
        </div>

        <div className="flex gap-2 mb-6">
          {['ALL', 'PAPER', 'KEYWORD'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-[#4A90E2] text-white'
                  : 'bg-[#161b22] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {f === 'PAPER' && <BookOpen className="w-3.5 h-3.5" />}
              {f === 'KEYWORD' && <Tag className="w-3.5 h-3.5" />}
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase() + 's'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bookmark className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-300">No bookmarks yet</p>
            <p className="text-sm mt-1">Search papers and bookmark them to access here</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {bookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  className="bg-[#161b22] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2.5 rounded-lg flex-shrink-0 ${
                        bookmark.bookmarkType === 'PAPER'
                          ? 'bg-[#4A90E2]/10'
                          : 'bg-purple-500/10'
                      }`}>
                        {bookmark.bookmarkType === 'PAPER'
                          ? <BookOpen className="w-5 h-5 text-[#4A90E2]" />
                          : <Tag className="w-5 h-5 text-purple-400" />
                        }
                      </div>

                      <div className="min-w-0">
                        {bookmark.bookmarkType === 'PAPER' && bookmark.paper ? (
                          <>
                            <h3 className="text-white font-semibold text-base mb-1 line-clamp-2 leading-snug">
                              {bookmark.paper.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                              {bookmark.paper.year && (
                                <span className="px-2 py-0.5 bg-[#0d1117] rounded">{bookmark.paper.year}</span>
                              )}
                              {bookmark.paper.citationCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#0d1117] text-[#4A90E2] rounded">
                                  {bookmark.paper.citationCount} citations
                                </span>
                              )}
                              {bookmark.paper.openAccess && (
                                <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded">Open Access</span>
                              )}
                            </div>
                            {bookmark.paper.keywords?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {bookmark.paper.keywords.slice(0, 5).map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              {bookmark.paper.paperUri && (
                                <a
                                  href={bookmark.paper.paperUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-[#4A90E2] hover:text-white transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View Paper
                                </a>
                              )}
                              <span className="text-xs text-gray-500">
                                Saved {new Date(bookmark.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-white font-semibold text-base mb-1">
                              {bookmark.keyword?.displayName || bookmark.keyword?.name || 'Unknown keyword'}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">Research keyword</p>
                            <span className="text-xs text-gray-500">
                              Saved {new Date(bookmark.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(bookmark)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400 text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
