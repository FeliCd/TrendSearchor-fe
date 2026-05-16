import { useState, useEffect } from 'react';
import { Search, Trash2, Loader2, X } from 'lucide-react';
import SectionCard from '@/components/ui/SectionCard';
import { recentSearchService } from '@/services/recentSearchService';

export default function RecentSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recentSearchService.getRecentSearches({ page: 0, size: 20 })
      .then(data => {
        setSearches(data.content || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setSearches(prev => prev.filter(s => s.id !== id));
    try {
      await recentSearchService.deleteRecentSearch(id);
    } catch {
      // Silently fail
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <SectionCard title="Recent Searches">
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 text-[#4A90E2] animate-spin" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Recent Searches">
      <div className="divide-y divide-white/[0.04]">
        {searches.length === 0 ? (
          <div className="px-5 py-8 text-center text-[#8b949e] text-sm">No recent searches yet.</div>
        ) : (
          searches.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-white/[0.02] transition-colors">
              <div className="w-6 h-6 rounded-md bg-[#4A90E2]/10 border border-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                <Search className="w-3 h-3 text-[#4A90E2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.searchQuery}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8b949e] capitalize">{item.searchType?.toLowerCase() || 'paper'} search</span>
                </div>
              </div>
              <span className="text-[10px] text-[#8b949e] whitespace-nowrap flex-shrink-0">{formatTime(item.createdAt)}</span>
              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all flex-shrink-0"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
