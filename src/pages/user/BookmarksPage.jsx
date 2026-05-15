import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Trash2, Search, Loader2, BookOpen, Tag } from 'lucide-react';
import { bookmarkService } from '@/services/bookmarkService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(0);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size: 10 };
      if (filter !== 'ALL') params.type = filter;
      const data = await bookmarkService.getBookmarks(params);
      setBookmarks(data.content || []);
    } catch (err) {
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemove = async (bookmarkId) => {
    try {
      await bookmarkService.removeBookmark(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (err) {
      setError('Failed to remove bookmark.');
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Bookmarks</h1>
            <p className="text-gray-400">Saved papers and keywords for later reference</p>
          </div>
          <Bookmark className="w-10 h-10 text-[#4A90E2]" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'PAPER', 'KEYWORD'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#4A90E2] text-white'
                  : 'bg-[#161b22] text-gray-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'PAPER' ? 'Papers' : 'Keywords'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <Alert type="error" message={error} />}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bookmark className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No bookmarks yet</p>
            <p className="text-sm mt-1">Save papers or keywords to access them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="bg-[#161b22] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${bookmark.bookmarkType === 'PAPER' ? 'bg-[#4A90E2]/10' : 'bg-purple-500/10'}`}>
                      {bookmark.bookmarkType === 'PAPER'
                        ? <BookOpen className="w-5 h-5 text-[#4A90E2]" />
                        : <Tag className="w-5 h-5 text-purple-400" />
                      }
                    </div>
                    <div>
                      {bookmark.bookmarkType === 'PAPER' && bookmark.paper ? (
                        <>
                          <h3 className="text-white font-medium mb-1">{bookmark.paper.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {bookmark.paper.year && <span>{bookmark.paper.year}</span>}
                            {bookmark.paper.citationCount > 0 && (
                              <span>{bookmark.paper.citationCount} citations</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-white font-medium">
                            {bookmark.keyword?.displayName || bookmark.keyword?.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">Research keyword</p>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(bookmark.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-400">Page {page + 1}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={bookmarks.length < 10}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
