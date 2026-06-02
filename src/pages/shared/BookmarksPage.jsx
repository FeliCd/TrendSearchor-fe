import { Bookmark } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { bookmarkService } from '@/services/bookmarkService';
import { useState, useEffect, useCallback } from 'react';

const FilterTabs = ({ filter, onFilterChange }) => (
  <div className="flex gap-2 mb-6">
    {['ALL', 'PAPER', 'KEYWORD'].map((k) => (
      <button key={k} onClick={() => onFilterChange(k)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
          filter === k ? 'bg-[#0058be] text-white' : 'bg-[#1e1e1e] text-gray-400 hover:text-white border border-gray-800'
        }`}>
        {k === 'ALL' ? 'All' : k === 'PAPER' ? 'Papers' : 'Keywords'}
      </button>
    ))}
  </div>
);

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (filter !== 'ALL') params.type = filter;
      const data = await bookmarkService.getBookmarks(params);
      setBookmarks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      showToast('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { loadBookmarks(); }, [loadBookmarks]);

  const handleRemove = async (bookmark) => {
    const prev = [...bookmarks];
    setBookmarks(bookmarks.filter((b) => b.id !== bookmark.id));
    try {
      if (bookmark.paper?.externalId) await bookmarkService.removePaperBookmark(bookmark.paper.externalId);
      else if (bookmark.keyword?.id) await bookmarkService.removeKeywordBookmark(bookmark.keyword.id);
      else await bookmarkService.removeBookmark(bookmark.id);
      showToast('Bookmark removed');
    } catch {
      setBookmarks(prev);
      showToast('Failed to remove bookmark', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#151515]">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Bookmarks</h1>
            <p className="text-gray-400 text-sm">Your saved papers and keywords for quick access</p>
          </div>
          <Bookmark className="w-10 h-10 text-[#0058be]" />
        </div>
        <FilterTabs filter={filter} onFilterChange={(f) => { setFilter(f); setPage(0); }} />
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : bookmarks.length === 0 ? (
          <EmptyState icon={Bookmark} title="No bookmarks yet" description="Search papers and bookmark them to access here" />
        ) : (
          <>
            <div className="space-y-3">
              {bookmarks.map((bookmark) => <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={handleRemove} />)}
            </div>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </div>
  );
}
