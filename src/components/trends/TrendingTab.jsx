import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { TopicRankingPanel } from './TopicRankingPanel';
import EmergingTopicsChart from './EmergingTopicsChart';
import AllTopicsList from './AllTopicsList';

export default function TrendingTab({ rankingData, rankingLoading, risingTopics, selectedKeyword, bookmarkedKeywordIds, onTopicSelect, onBookmark }) {
  if (rankingLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#0058be] animate-spin" /></div>;
  return (
    <div className="space-y-4">
      {rankingData.ranking?.length > 0 && (
        <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Topic Ranking</h3>
          </div>
          <TopicRankingPanel
            risingTopics={risingTopics}
            stableTopics={rankingData.ranking.filter((t) => t.status === 'STABLE' || t.status === 'MATURE' || (t.growthRate != null && Math.abs(t.growthRate) <= 0.1))}
            decliningTopics={rankingData.ranking.filter((t) => t.status === 'DECLINING' || (t.growthRate != null && t.growthRate < -0.1))}
            onTopicClick={onTopicSelect}
          />
        </div>
      )}
      {rankingData.emerging?.length > 0 && (
        <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Emerging Topics</h3>
            <span className="text-[10px] text-gray-500">Low historical + High recent growth</span>
          </div>
          <EmergingTopicsChart topics={rankingData.emerging} />
        </div>
      )}
      {rankingData.ranking?.length > 0 && (
        <AllTopicsList topics={rankingData.ranking} selectedKeyword={selectedKeyword}
          bookmarkedKeywordIds={bookmarkedKeywordIds} onTopicSelect={onTopicSelect} onBookmark={onBookmark} />
      )}
    </div>
  );
}
