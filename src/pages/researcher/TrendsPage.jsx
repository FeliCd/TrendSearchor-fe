import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, BarChart2, Loader2, Bookmark, TrendingDown,
  CheckCircle, XCircle, GitCompare, Network, Zap, Sparkles, Search, ArrowRight
} from 'lucide-react';
import { trendService } from '@/services/trendService';
import { bookmarkService } from '@/services/bookmarkService';
import DashboardLayout from '@/components/ui/DashboardLayout';
import TrendSearchBar from '@/components/trends/TrendSearchBar';
import PublicationTimelineChart, { YoYGrowthChart } from '@/components/trends/PublicationTimelineChart';
import TrendInsightCard from '@/components/trends/TrendInsightCard';
import { TopicRankingPanel } from '@/components/trends/TopicRankingPanel';
import EmergingTopicsChart from '@/components/trends/EmergingTopicsChart';
import KeywordNetworkGraph from '@/components/trends/KeywordNetworkGraph';
import TopicComparisonChart from '@/components/trends/TopicComparisonChart';
import YearRangeFilter from '@/components/trends/YearRangeFilter';
import { useLenis } from '@/providers/LenisProvider';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'trending', label: 'Trending', icon: Zap },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'network', label: 'Network', icon: Network },
];

const STATUS_BADGE = {
  EMERGING: { label: 'Emerging', cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  HOT: { label: 'Hot', cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
  STABLE: { label: 'Stable', cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  MATURE: { label: 'Mature', cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  DECLINING: { label: 'Declining', cls: 'bg-gray-500/15 text-gray-400 border border-gray-500/30' },
};

export default function TrendsPage() {
  const { disableGlobal, enableGlobal } = useLenis();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Restore native scroll on this page — Lenis smooth scroll interferes with page scroll
  useEffect(() => {
    const lenis = window.__lenisInstance;
    if (lenis) {
      lenis.stop();
      lenis.destroy();
      window.__lenisInstance = null;
    }
    document.documentElement.classList.add('lenis-disabled');
    document.documentElement.style.overflow = '';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = '';

    // Force body to scrollable
    const restore = () => {
      document.documentElement.classList.remove('lenis-disabled');
      enableGlobal();
    };

    return restore;
  }, [disableGlobal, enableGlobal]);

  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [rankingData, setRankingData] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);

  const [compareKeywords, setCompareKeywords] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const [networkData, setNetworkData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(false);

  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadTrendingKeywords = useCallback(async () => {
    try {
      const data = await trendService.getTrendingKeywords(50);
      setTrendingKeywords(data);
    } catch (err) {
      console.error('Failed to load keywords:', err);
    }
  }, []);

  const loadRankingData = useCallback(async () => {
    setRankingLoading(true);
    try {
      const [ranking, emerging] = await Promise.all([
        trendService.getTrendingRanking(30),
        trendService.getEmergingTopics(20),
      ]);
      setRankingData({ ranking, emerging });
    } catch (err) {
      console.error('Failed to load ranking:', err);
    } finally {
      setRankingLoading(false);
    }
  }, []);

  const loadAnalysis = useCallback(async (keyword, sYear, eYear) => {
    if (!keyword?.trim()) return;
    setAnalysisLoading(true);
    try {
      const data = await trendService.analyzeKeyword(keyword.trim(), sYear, eYear);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to load analysis:', err);
      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  const loadComparison = useCallback(async (keywords) => {
    if (!keywords || keywords.length < 2) {
      setComparison(null);
      return;
    }
    setComparisonLoading(true);
    try {
      const data = await trendService.compareTopicsFull(keywords, startYear, endYear);
      setComparison(data);
    } catch (err) {
      console.error('Failed to load comparison:', err);
    } finally {
      setComparisonLoading(false);
    }
  }, [startYear, endYear]);

  const loadNetwork = useCallback(async (keyword) => {
    if (!keyword?.trim()) return;
    setNetworkLoading(true);
    try {
      const data = await trendService.getRelatedKeywords(keyword.trim(), 15);
      setNetworkData(data);
    } catch (err) {
      console.error('Failed to load network:', err);
      setNetworkData(null);
    } finally {
      setNetworkLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingKeywords();
    loadRankingData();
  }, [loadTrendingKeywords, loadRankingData]);

  useEffect(() => {
    if (selectedKeyword) {
      loadAnalysis(selectedKeyword, startYear, endYear);
      if (activeTab === 'network') {
        loadNetwork(selectedKeyword);
      }
    }
  }, [selectedKeyword, startYear, endYear, activeTab, loadAnalysis, loadNetwork]);

  useEffect(() => {
    if (compareKeywords.length >= 2) {
      loadComparison(compareKeywords);
    } else {
      setComparison(null);
    }
  }, [compareKeywords, loadComparison]);

  const handleSearch = useCallback((keyword) => {
    setSearchQuery(keyword);
    setSelectedKeyword(keyword);
    setHasSearched(true);
  }, []);

  const handleKeywordSelect = useCallback((kw) => {
    const name = kw.displayName || kw.keyword || kw;
    setSearchQuery(name);
    setSelectedKeyword(name);
    setHasSearched(true);
  }, []);

  const handleCompareToggle = useCallback((keyword) => {
    setCompareKeywords((prev) => {
      const name = keyword.displayName || keyword.keyword || keyword;
      if (prev.includes(name)) return prev.filter((k) => k !== name);
      if (prev.length >= 4) return prev;
      return [...prev, name];
    });
  }, []);

  const handleKeywordBookmark = useCallback(async (kw) => {
    const kwId = kw.id || kw.keywordId;
    if (!kwId) { showToast('Cannot bookmark: keyword not yet saved to database', 'error'); return; }
    const isBookmarked = bookmarkedKeywordIds.has(kwId);
    setBookmarkedKeywordIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(kwId); else next.add(kwId);
      return next;
    });
    try {
      if (isBookmarked) {
        await bookmarkService.removeKeywordBookmark(kwId);
        showToast(`"${kw.displayName || kw.keyword}" removed from bookmarks`);
      } else {
        await bookmarkService.addKeywordBookmark(kwId);
        showToast(`"${kw.displayName || kw.keyword}" added to bookmarks`);
      }
    } catch (err) {
      setBookmarkedKeywordIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(kwId); else next.delete(kwId);
        return next;
      });
      showToast(err?.response?.data?.message || 'Failed to update bookmark', 'error');
    }
  }, [bookmarkedKeywordIds, showToast]);

  const risingTopics = useMemo(() => {
    if (!rankingData.ranking) return [];
    return rankingData.ranking.filter(
      (t) => t.status === 'HOT' || t.status === 'EMERGING' || (t.growthRate != null && t.growthRate > 0.1)
    );
  }, [rankingData]);

  const statusConfig = STATUS_BADGE[analysis?.status] || STATUS_BADGE.STABLE;

  const displayName = analysis?.displayName || analysis?.keyword || selectedKeyword || '';

  return (
    <DashboardLayout
      title="Research Trends"
      description="Analyze publication patterns, discover emerging topics, and compare research fields"
    >
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <TrendSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onSuggestionClick={handleKeywordSelect}
            onClear={() => { setSearchQuery(''); setHasSearched(false); }}
            loading={analysisLoading}
            suggestions={trendingKeywords}
            className="flex-1 max-w-xl"
          />
          <div className="flex items-center gap-2">
            <YearRangeFilter
              startYear={startYear}
              endYear={endYear}
              onChange={(s, e) => { setStartYear(s); setEndYear(e); }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#0d1117] rounded-xl border border-white/5 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#4A90E2] text-white shadow-sm'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            {analysisLoading && !analysis ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
              </div>
            ) : analysis ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <KpiCard
                    label="Total Papers"
                    value={analysis.totalPapers?.toLocaleString() ?? '—'}
                    sub="All years"
                    color="#60a5fa"
                  />
                  <KpiCard
                    label="YoY Growth"
                    value={analysis.growthRate != null
                      ? `${analysis.growthRate >= 0 ? '+' : ''}${Math.round(analysis.growthRate * 100)}%`
                      : '—'}
                    sub={analysis.growthRate >= 0 ? 'Growing' : analysis.growthRate < 0 ? 'Declining' : 'No change'}
                    color={analysis.growthRate >= 0 ? '#34d399' : '#f87171'}
                  />
                  <KpiCard
                    label="Peak Year"
                    value={analysis.peakYear?.toString() ?? '—'}
                    sub={analysis.peakPaperCount ? `${analysis.peakPaperCount.toLocaleString()} papers` : undefined}
                    color="#c084fc"
                  />
                  <KpiCard
                    label="Forecast"
                    value={analysis.forecastNextYear != null
                      ? `${analysis.forecastNextYear >= 0 ? '+' : ''}${Math.round(analysis.forecastNextYear * 100)}%`
                      : 'N/A'}
                    sub="Next year"
                    color="#fbbf24"
                  />
                </div>

                <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {displayName}
                      </h3>
                      {analysis.yearlyData && analysis.yearlyData.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {analysis.yearlyData[0].year} — {analysis.yearlyData[analysis.yearlyData.length - 1].year}
                          {' · '}
                          {analysis.yearlyData.length} year{analysis.yearlyData.length !== 1 ? 's' : ''} of data
                          {' · '}
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusConfig.cls}`}>
                            {statusConfig.label}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <PublicationTimelineChart
                    yearlyData={analysis.yearlyData || []}
                    keyword={analysis.keyword}
                  />
                  {analysis.yearlyData && analysis.yearlyData.some(d => d.yoyGrowth != null) && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Year-over-Year Growth</h4>
                      <YoYGrowthChart yearlyData={analysis.yearlyData} />
                    </div>
                  )}
                </div>

                <TrendInsightCard analysis={analysis} />

                {hasSearched && trendingKeywords.length > 0 && (
                  <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Related Keywords</h3>
                      <span className="text-xs text-gray-500">Click to explore</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingKeywords.slice(0, 20).map((kw) => {
                        const name = kw.displayName || kw.keyword;
                        const isSelected = name === selectedKeyword;
                        const isBookmarked = bookmarkedKeywordIds.has(kw.id);
                        return (
                          <div key={kw.keyword} className="group relative">
                            <button
                              onClick={() => handleKeywordSelect(kw)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? 'bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/40'
                                  : 'bg-[#0d1117] text-gray-400 border border-white/5 hover:bg-[#0d1117]/60 hover:text-white'
                              }`}
                            >
                              {name}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleKeywordBookmark(kw); }}
                              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Bookmark className={`w-3 h-3 ${isBookmarked ? 'text-[#4A90E2] fill-current' : 'text-gray-600'}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-white/5 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 opacity-20" />
                </div>
                <p className="text-base font-medium text-gray-400 mb-1">Search for a research keyword</p>
                <p className="text-sm text-gray-600">Type a keyword above to see publication trends and insights</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-4">
            {rankingLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
              </div>
            ) : (
              <>
                {rankingData.ranking && rankingData.ranking.length > 0 && (
                  <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">Topic Ranking</h3>
                    </div>
                    <TopicRankingPanel
                      risingTopics={risingTopics}
                      stableTopics={rankingData.ranking.filter(
                        (t) => t.status === 'STABLE' || t.status === 'MATURE' || (t.growthRate != null && Math.abs(t.growthRate) <= 0.1)
                      )}
                      decliningTopics={rankingData.ranking.filter(
                        (t) => t.status === 'DECLINING' || (t.growthRate != null && t.growthRate < -0.1)
                      )}
                      onTopicClick={handleKeywordSelect}
                    />
                  </div>
                )}

                {rankingData.emerging && rankingData.emerging.length > 0 && (
                  <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-semibold text-white">Emerging Topics</h3>
                      <span className="text-[10px] text-gray-500">Low historical + High recent growth</span>
                    </div>
                    <EmergingTopicsChart topics={rankingData.emerging} />
                  </div>
                )}

                {rankingData.ranking && rankingData.ranking.length > 0 && (
                  <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">All Topics ({rankingData.ranking.length})</h3>
                    <div className="space-y-1">
                      {rankingData.ranking.map((topic) => {
                        const name = topic.displayName || topic.keyword;
                        const isSelected = name === selectedKeyword;
                        const isBookmarked = bookmarkedKeywordIds.has(topic.id);
                        return (
                          <div
                            key={topic.keyword}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#4A90E2]/10 border border-[#4A90E2]/20'
                                : 'bg-[#0d1117] border border-transparent hover:bg-[#0d1117]/60'
                            }`}
                            onClick={() => handleKeywordSelect(topic)}
                          >
                            <span className="text-xs font-bold text-gray-600 w-6 shrink-0">#{topic.rank}</span>
                            <span className="flex-1 text-sm font-medium text-white truncate">{name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              {topic.growthRate != null && (
                                <span className={`text-xs font-medium ${
                                  topic.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {topic.growthRate >= 0 ? '+' : ''}{Math.round(topic.growthRate * 100)}%
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {(topic.totalPapers || 0).toLocaleString()}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleKeywordBookmark(topic); }}
                                className="p-1"
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-[#4A90E2] fill-current' : 'text-gray-600'}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <GitCompare className="w-4 h-4 text-[#4A90E2]" />
                <h3 className="text-sm font-semibold text-white">Compare Topics</h3>
                <span className="text-[10px] text-gray-500">Select 2–4 keywords to compare</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {compareKeywords.map((kw) => (
                  <div
                    key={kw}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#4A90E2]/10 border border-[#4A90E2]/30 rounded-lg text-xs text-[#4A90E2]"
                  >
                    <span>{kw}</span>
                    <button onClick={() => handleCompareToggle(kw)} className="hover:text-red-400">
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {compareKeywords.length < 4 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) { handleCompareToggle(e.target.value); e.target.value = ''; }
                    }}
                    value=""
                    className="bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-[#4A90E2]/50"
                  >
                    <option value="">+ Add keyword</option>
                    {trendingKeywords
                      .filter((kw) => !compareKeywords.includes(kw.displayName || kw.keyword))
                      .map((kw) => (
                        <option key={kw.keyword} value={kw.displayName || kw.keyword}>
                          {kw.displayName || kw.keyword}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              {comparisonLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
                </div>
              ) : comparison ? (
                <TopicComparisonChart comparison={comparison} />
              ) : compareKeywords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <GitCompare className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-sm">Select at least 2 keywords to compare</p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-[#4A90E2]" />
                <h3 className="text-sm font-semibold text-white">Keyword Relationships</h3>
                <span className="text-[10px] text-gray-500">
                  {selectedKeyword ? `Related to "${selectedKeyword}"` : 'Search a keyword first'}
                </span>
              </div>
              {networkLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
                </div>
              ) : selectedKeyword ? (
                <KeywordNetworkGraph
                  data={networkData}
                  onKeywordClick={handleKeywordSelect}
                  selectedKeyword={selectedKeyword}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Network className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-sm">Search a keyword to see its relationships</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs font-medium" style={{ color }}>{label}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}
