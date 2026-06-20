import { useCallback } from 'react';

export function useBookmarkToggle({ bookmarkedIds, setBookmarkedIds, onAdd, onRemove, showToast }) {
  const toggle = useCallback(async (id, itemLabel) => {
    if (!id) {
      showToast?.('Cannot bookmark: item not saved to database', 'error');
      return;
    }
    const isBookmarked = bookmarkedIds.has(id);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      isBookmarked ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      if (isBookmarked) {
        await onRemove?.(id);
        showToast?.(`"${itemLabel}" removed from bookmarks`);
      } else {
        await onAdd?.(id);
        showToast?.(`"${itemLabel}" added to bookmarks`);
      }
    } catch (err) {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        isBookmarked ? next.add(id) : next.delete(id);
        return next;
      });
      showToast?.(err?.response?.data?.message || 'Failed to update bookmark', 'error');
    }
  }, [bookmarkedIds, setBookmarkedIds, onAdd, onRemove, showToast]);

  return { toggle, isBookmarked: (id) => bookmarkedIds.has(id) };
}
