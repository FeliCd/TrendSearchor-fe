import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { trendService } from '@/services/trendService';
import { bookmarkService } from '@/services/bookmarkService';
import PageHeader from '@/components/ui/PageHeader';
import TabBar from '@/components/trends/TabBar';
import TrendSearchBar from '@/components/trends/TrendSearchBar';
import YearRangeFilter from '@/components/trends/YearRangeFilter';
import KeywordOverview from '@/components/trends/KeywordOverview';
import TrendingTab from '@/components/trends/TrendingTab';
import CompareTab from '@/components/trends/CompareTab';
import NetworkTab from '@/components/trends/NetworkTab';
import { TOPIC_STATUS_CONFIG } from '@/constants/chartConfig';

export default function TrendsPage() {
  /* ── State ─────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('overview');

  // Search
  const [searchInput, setSearchInput] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestTimer = useRef(null);

  // Year filter
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  // Overview tab
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Trending tab
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [rankingData, setRankingData] = useState({ ranking: [], emerging: [] });
  const [rankingLoading, setRankingLoading] = useState(false);

  // Compare tab
  const [compareKeywords, setCompareKeywords] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Network tab
  const [networkData, setNetworkData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(false);

  // Bookmarks
  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState(new Set());

  /* ── Initial data loading ──────────────────────────────────────── */

  useEffect(() => {
    // Load trending keywords for suggestions and sidebar
    trendService.getTrendingKeywords(30)
      .then(setTrendingKeywords)
      .catch(() => setTrendingKeywords([]));

    // Load bookmarked keywords
    bookmarkService.getBookmarks({ type: 'KEYWORD' })
      .then((res) => {
        const data = res?.content || res || [];
        const ids = new Set(data.filter(b => b.keyword).map(b => b.keyword.id));
        setBookmarkedKeywordIds(ids);
      })
      .catch(() => {});
  }, []);

  /* ── Load ranking data when switching to trending tab ────────── */

  useEffect(() => {
    if (activeTab === 'trending' && rankingData.ranking.length === 0 && !rankingLoading) {
      setRankingLoading(true);
      Promise.all([
        trendService.getTrendingRanking(30).catch(() => []),
        trendService.getEmergingTopics(10).catch(() => []),
      ]).then(([ranking, emerging]) => {
        setRankingData({ ranking, emerging });
      }).finally(() => setRankingLoading(false));
    }
  }, [activeTab, rankingData.ranking.length, rankingLoading]);

  /* ── Derived data ──────────────────────────────────────────────── */

  const risingTopics = rankingData.ranking.filter(
    (t) => t.status === 'EMERGING' || t.status === 'HOT' || (t.growthRate != null && t.growthRate > 0.1)
  );

  const statusConfig = analysis?.status
    ? TOPIC_STATUS_CONFIG[analysis.status] || TOPIC_STATUS_CONFIG.STABLE
    : TOPIC_STATUS_CONFIG.STABLE;

  const displayName = selectedKeyword || 'Publication Trend';

  /* ── Search handlers ───────────────────────────────────────────── */

  const handleSearchInputChange = useCallback((value) => {
    setSearchInput(value);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    suggestTimer.current = setTimeout(async () => {
      try {
        const results = await trendService.searchAndAnalyze(value.trim());
        if (Array.isArray(results)) {
          setSuggestions(results.slice(0, 8));
        } else if (results?.keyword) {
          setSuggestions([results]);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      }
    }, 400);
  }, []);

  const analyzeKeyword = useCallback(async (keyword) => {
    if (!keyword) return;
    setSelectedKeyword(keyword);
    setHasSearched(true);
    setAnalysisLoading(true);
    setActiveTab('overview');
    try {
      const result = await trendService.analyzeKeyword(keyword, startYear, endYear);
      setAnalysis(result);
    } catch {
      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  }, [startYear, endYear]);

  const handleSearch = useCallback((value) => {
    const keyword = value.trim();
    if (!keyword) return;
    setSearchInput(keyword);
    analyzeKeyword(keyword);
  }, [analyzeKeyword]);

  const handleSuggestionClick = useCallback((suggestion) => {
    const keyword = suggestion.displayName || suggestion.keyword || suggestion;
    setSearchInput(keyword);
    analyzeKeyword(keyword);
  }, [analyzeKeyword]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSelectedKeyword(null);
    setAnalysis(null);
    setHasSearched(false);
    setSuggestions([]);
    setNetworkData(null);
  }, []);

  /* ── Topic select (from ranking, related keywords, etc.) ──────── */

  const handleTopicSelect = useCallback((topic) => {
    const keyword = topic.displayName || topic.keyword;
    setSearchInput(keyword);
    analyzeKeyword(keyword);
  }, [analyzeKeyword]);

  const handleKeywordSelectFromNetwork = useCallback((keyword) => {
    setSearchInput(keyword);
    analyzeKeyword(keyword);
  }, [analyzeKeyword]);

  /* ── Year range ────────────────────────────────────────────────── */

  const handleYearChange = useCallback((start, end) => {
    setStartYear(start);
    setEndYear(end);
    // Re-analyze if a keyword is selected
    if (selectedKeyword) {
      setAnalysisLoading(true);
      trendService.analyzeKeyword(selectedKeyword, start, end)
        .then(setAnalysis)
        .catch(() => setAnalysis(null))
        .finally(() => setAnalysisLoading(false));
    }
  }, [selectedKeyword]);

  /* ── Compare ───────────────────────────────────────────────────── */

  const handleCompareToggle = useCallback((keyword) => {
    setCompareKeywords((prev) => {
      if (prev.includes(keyword)) return prev.filter((k) => k !== keyword);
      if (prev.length >= 4) return prev;
      return [...prev, keyword];
    });
  }, []);

  useEffect(() => {
    if (activeTab !== 'compare' || compareKeywords.length < 2) {
      setComparison(null);
      return;
    }
    setComparisonLoading(true);
    trendService.compareTopicsFull(compareKeywords.join(','), startYear, endYear)
      .then(setComparison)
      .catch(() => setComparison(null))
      .finally(() => setComparisonLoading(false));
  }, [activeTab, compareKeywords, startYear, endYear]);

  /* ── Network ───────────────────────────────────────────────────── */

  useEffect(() => {
    if (activeTab !== 'network' || !selectedKeyword) {
      return;
    }
    setNetworkLoading(true);
    trendService.getRelatedKeywords(selectedKeyword, 15)
      .then(setNetworkData)
      .catch(() => setNetworkData(null))
      .finally(() => setNetworkLoading(false));
  }, [activeTab, selectedKeyword]);

  /* ── Bookmark toggle ───────────────────────────────────────────── */

  const handleBookmark = useCallback(async (topic) => {
    const id = topic.id;
    if (!id) return;
    try {
      if (bookmarkedKeywordIds.has(id)) {
        await bookmarkService.removeKeywordBookmark(id);
        setBookmarkedKeywordIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await bookmarkService.addKeywordBookmark(id);
        setBookmarkedKeywordIds((prev) => new Set(prev).add(id));
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  }, [bookmarkedKeywordIds]);

  /* ── Render ────────────────────────────────────────────────────── */

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <KeywordOverview
            analysis={analysis}
            loading={analysisLoading}
            displayName={displayName}
            statusConfig={statusConfig}
            trendingKeywords={trendingKeywords}
            selectedKeyword={selectedKeyword}
            bookmarkedKeywordIds={bookmarkedKeywordIds}
            hasSearched={hasSearched}
            onKeywordSelect={handleTopicSelect}
            onBookmark={handleBookmark}
          />
        );

      case 'trending':
        return (
          <TrendingTab
            rankingData={rankingData}
            rankingLoading={rankingLoading}
            risingTopics={risingTopics}
            selectedKeyword={selectedKeyword}
            bookmarkedKeywordIds={bookmarkedKeywordIds}
            onTopicSelect={handleTopicSelect}
            onBookmark={handleBookmark}
          />
        );

      case 'compare':
        return (
          <CompareTab
            compareKeywords={compareKeywords}
            comparison={comparison}
            comparisonLoading={comparisonLoading}
            trendingKeywords={trendingKeywords}
            onCompareToggle={handleCompareToggle}
          />
        );

      case 'network':
        return (
          <NetworkTab
            selectedKeyword={selectedKeyword}
            networkData={networkData}
            networkLoading={networkLoading}
            onKeywordSelect={handleKeywordSelectFromNetwork}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader
        title="Publication Trends"
        description="Analyze research trends, discover emerging topics, and compare keywords"
      />

      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin" data-lenis-prevent="true">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">

          {/* ── Toolbar: Search + Filter + Tabs ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <TrendSearchBar
              value={searchInput}
              onChange={handleSearchInputChange}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              loading={analysisLoading}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              className="flex-1 min-w-0"
            />
            <div className="flex items-center gap-2 shrink-0">
              <YearRangeFilter
                startYear={startYear}
                endYear={endYear}
                onChange={handleYearChange}
              />
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="space-y-4">
            {renderTabContent()}
          </div>

        </div>
      </div>
    </>
  );
}
