import { Bookmark } from 'lucide-react';

export default function AllTopicsList({ topics, selectedKeyword, bookmarkedKeywordIds, onTopicSelect, onBookmark }) {
  return (
    <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">All Topics ({topics.length})</h3>
      <div className="space-y-1">
        {topics.map((topic) => {
          const name = topic.displayName || topic.keyword;
          const isSelected = name === selectedKeyword;
          const isBookmarked = bookmarkedKeywordIds.has(topic.id);
          return (
            <div key={topic.keyword}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                isSelected ? 'bg-[#4A90E2]/10 border border-[#4A90E2]/20'
                  : 'bg-[var(--dark-bg-base)] border border-transparent hover:bg-[var(--dark-bg-base)]/60'
              }`}
              onClick={() => onTopicSelect(topic)}>
              <span className="text-xs font-bold text-gray-600 w-6 shrink-0">#{topic.rank}</span>
              <span className="flex-1 text-sm font-medium text-white truncate">{name}</span>
              <div className="flex items-center gap-3 shrink-0">
                {topic.growthRate != null && (
                  <span className={`text-xs font-medium ${topic.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {topic.growthRate >= 0 ? '+' : ''}{Math.round(topic.growthRate * 100)}%
                  </span>
                )}
                <span className="text-xs text-gray-500">{(topic.totalPapers || 0).toLocaleString()}</span>
                <button onClick={(e) => { e.stopPropagation(); onBookmark(topic); }} className="p-1">
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-[#4A90E2] fill-current' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
