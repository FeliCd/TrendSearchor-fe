import { useState, useCallback } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Bookmark } from 'lucide-react';
import PublicationTimelineChart from './PublicationTimelineChart';
import YoYGrowthChart from './YoYGrowthChart';
import TrendInsightCard from './TrendInsightCard';
import { KpiCard } from './TrendKpiCards';

export default function KeywordOverview({ analysis, loading, displayName, statusConfig,
  trendingKeywords, selectedKeyword, bookmarkedKeywordIds, hasSearched,
  onKeywordSelect, onBookmark }) {
  if (loading && !analysis) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0058be] animate-spin" /></div>;
  if (!analysis) return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="w-16 h-16 rounded-2xl bg-[#1e1e1e] border-2 border-gray-800 flex items-center justify-center mb-4">
        <Search className="w-7 h-7 opacity-20" />
      </div>
      <p className="text-base font-medium text-gray-400 mb-1">Search for a research keyword</p>
      <p className="text-sm text-gray-600">Type a keyword above to see publication trends and insights</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Papers" value={analysis.totalPapers?.toLocaleString() ?? '—'} sub="All years" color="#60a5fa" />
        <KpiCard label="YoY Growth"
          value={analysis.growthRate != null ? `${analysis.growthRate >= 0 ? '+' : ''}${Math.round(analysis.growthRate * 100)}%` : '—'}
          sub={analysis.growthRate >= 0 ? 'Growing' : analysis.growthRate < 0 ? 'Declining' : 'No change'}
          color={analysis.growthRate >= 0 ? '#34d399' : '#f87171'} />
        <KpiCard label="Peak Year" value={analysis.peakYear?.toString() ?? '—'}
          sub={analysis.peakPaperCount ? `${analysis.peakPaperCount.toLocaleString()} papers` : undefined} color="#c084fc" />
        <KpiCard label="Forecast"
          value={analysis.forecastNextYear != null ? `${Math.round(analysis.forecastNextYear * 100)}%` : 'N/A'}
          sub="Next year" color="#fbbf24" />
      </div>

      <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-white">{displayName}</h3>
            {analysis.yearlyData?.length > 0 && (
              <p className="text-xs text-gray-500">
                {analysis.yearlyData[0].year} — {analysis.yearlyData[analysis.yearlyData.length - 1].year}
                {' · '}{analysis.yearlyData.length} year{analysis.yearlyData.length !== 1 ? 's' : ''} of data{' · '}
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusConfig.cls}`}>{statusConfig.label}</span>
              </p>
            )}
          </div>
        </div>
        <PublicationTimelineChart yearlyData={analysis.yearlyData || []} keyword={analysis.keyword} />
        {analysis.yearlyData?.some((d) => d.yoyGrowth != null) && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Year-over-Year Growth</h4>
            <YoYGrowthChart yearlyData={analysis.yearlyData} />
          </div>
        )}
      </div>

      <TrendInsightCard analysis={analysis} />

      {hasSearched && trendingKeywords.length > 0 && (
        <RelatedKeywords tags={trendingKeywords} selectedKeyword={selectedKeyword}
          bookmarkedKeywordIds={bookmarkedKeywordIds} onSelect={onKeywordSelect} onBookmark={onBookmark} />
      )}
    </>
  );
}

export function RelatedKeywords({ tags, selectedKeyword, bookmarkedKeywordIds, onSelect, onBookmark }) {
  return (
    <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Related Keywords</h3>
        <span className="text-xs text-gray-500">Click to explore</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 20).map((kw) => {
          const name = kw.displayName || kw.keyword;
          const isSelected = name === selectedKeyword;
          const isBookmarked = bookmarkedKeywordIds.has(kw.id);
          return (
            <div key={kw.keyword} className="group relative">
              <button onClick={() => onSelect(kw)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium transition-all ${
                  isSelected ? 'bg-[#0058be]/20 text-[#0058be] border border-[#0058be]/40'
                    : 'bg-[#151515] text-gray-400 border-2 border-gray-800 hover:bg-[#151515]/60 hover:text-white'
                }`}>
                {name}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onBookmark(kw); }}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'text-[#0058be] fill-current' : 'text-gray-600'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
