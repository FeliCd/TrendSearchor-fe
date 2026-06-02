import { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import TrendSearchBar from '@/components/trends/TrendSearchBar';
import YearRangeFilter from '@/components/trends/YearRangeFilter';
import KeywordOverview from '@/components/trends/KeywordOverview';
import CompareTab from '@/components/trends/CompareTab';
import { TopicRankingPanel } from '@/components/trends/TopicRankingPanel';
import TrendingTab from '@/components/trends/TrendingTab';
import NetworkTab from '@/components/trends/NetworkTab';
import TabBar from '@/components/trends/TabBar';
import Toast from '@/components/ui/Toast';
import { trendService } from '@/services/trendService';
import { bookmarkService } from '@/services/bookmarkService';
import { useLenis } from '@/providers/LenisProvider';
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle';

const SB = {
  EMERGING: { cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  HOT: { cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
  STABLE: { cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  MATURE: { cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  DECLINING: { cls: 'bg-gray-500/15 text-gray-400 border border-gray-500/30' },
};

const getKeywordLabel = (k) => k.displayName || k.keyword || '';
const getKeywordId = (k) => k.id || k.keywordId;

export default function TrendsPage() {
  const { disableGlobal, enableGlobal } = useLenis();
  const [tab, setTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [kw, setKw] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [rankData, setRankData] = useState({ ranking: [], emerging: [] });
  const [rankLoading, setRankLoading] = useState(true);
  const [compare, setCompare] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [networkData, setNetworkData] = useState(null);
  const [netLoading, setNetLoading] = useState(false);
  const [bkmIds, setBkmIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [sY, setSY] = useState(null);
  const [eY, setEY] = useState(null);

  const showToast = useCallback((msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3500); }, []);

  const { toggle: toggleKeywordBookmark } = useBookmarkToggle({
    bookmarkedIds: bkmIds,
    setBookmarkedIds: setBkmIds,
    onAdd: (id) => bookmarkService.addKeywordBookmark(id),
    onRemove: (id) => bookmarkService.removeKeywordBookmark(id),
    showToast,
  });

  useEffect(() => {
    const d = document.documentElement;
    if (window.__lenisInstance) { window.__lenisInstance.stop(); window.__lenisInstance.destroy(); window.__lenisInstance = null; }
    d.classList.add('lenis-disabled'); d.style.overflow = ''; d.style.scrollBehavior = 'auto'; document.body.style.overflow = '';
    return () => { d.classList.remove('lenis-disabled'); enableGlobal(); };
  }, [disableGlobal, enableGlobal]);

  useEffect(() => {
    Promise.all([
      trendService.getTrendingKeywords(50).catch(() => []),
      Promise.all([trendService.getTrendingRanking(30), trendService.getEmergingTopics(20)])
        .then(([r, e]) => setRankData({ ranking: r, emerging: e }))
        .catch(() => setRankData({ ranking: [], emerging: [] })).finally(() => setRankLoading(false)),
    ]).then(([k]) => setKw(k));
  }, []);

  const loadAnalysis = useCallback(async (k, s, e) => {
    if (!k?.trim()) return;
    setAnalysisLoading(true);
    try { setAnalysis(await trendService.analyzeKeyword(k.trim(), s, e)); }
    catch { setAnalysis(null); }
    finally { setAnalysisLoading(false); }
  }, []);

  useEffect(() => { if (selected) { loadAnalysis(selected, sY, eY); if (tab === 'network') setNetLoading(true).then(async () => { try { setNetworkData(await trendService.getRelatedKeywords(selected.trim(), 15)); } catch { setNetworkData(null); } setNetLoading(false); }); } },
    [selected, sY, eY, tab, loadAnalysis]);
  useEffect(() => { if (compare.length >= 2) { setCompareLoading(true); trendService.compareTopicsFull(compare, sY, eY).then(setComparison).catch(() => setComparison(null)).finally(() => setCompareLoading(false)); } else setComparison(null); }, [compare, sY, eY]);

  const rising = useMemo(() => rankData.ranking?.filter((t) => t.status === 'HOT' || t.status === 'EMERGING' || (t.growthRate != null && t.growthRate > 0.1)) || [], [rankData]);
  const statusConfig = SB[analysis?.status] || SB.STABLE;
  const displayName = analysis?.displayName || analysis?.keyword || selected || '';

  return (
    <DashboardLayout title="Research Trends" description="Analyze publication patterns, discover emerging topics, and compare research fields">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <TrendSearchBar value={query} onChange={setQuery}
            onSearch={(q) => { setQuery(q); setSelected(q); setSearched(true); }}
            onSuggestionClick={(k) => { const n = k.displayName || k.keyword || k; setQuery(n); setSelected(n); setSearched(true); }}
            onClear={() => { setQuery(''); setSearched(false); }}
            loading={analysisLoading} suggestions={kw} className="flex-1 max-w-xl" />
          <YearRangeFilter startYear={sY} endYear={eY} onChange={(s, e) => { setSY(s); setEY(e); }} />
        </div>
        <TabBar activeTab={tab} onTabChange={setTab} />
        {tab === 'overview' && (
          <KeywordOverview analysis={analysis} loading={analysisLoading} displayName={displayName} statusConfig={statusConfig}
            trendingKeywords={kw} selectedKeyword={selected} bookmarkedKeywordIds={bkmIds}
            hasSearched={searched} onKeywordSelect={(k) => { const n = k.displayName || k.keyword || k; setQuery(n); setSelected(n); setSearched(true); }}
            onBookmark={(k) => toggleKeywordBookmark(getKeywordId(k), getKeywordLabel(k))}
          />
        )}
        {tab === 'trending' && (
          <TrendingTab rankingData={rankData} rankingLoading={rankLoading} risingTopics={rising}
            selectedKeyword={selected} bookmarkedKeywordIds={bkmIds}
            onTopicSelect={(k) => { const n = k.displayName || k.keyword || k; setQuery(n); setSelected(n); setSearched(true); }}
            onBookmark={(k) => toggleKeywordBookmark(getKeywordId(k), getKeywordLabel(k))}
          />
        )}
        {tab === 'compare' && (
          <CompareTab compareKeywords={compare} comparison={comparison} comparisonLoading={compareLoading}
            trendingKeywords={kw}
            onCompareToggle={(k) => {
              const n = k.displayName || k.keyword || k;
              setCompare((p) => p.includes(n) ? p.filter((x) => x !== n) : p.length < 4 ? [...p, n] : p);
            }} />
        )}
        {tab === 'network' && (
          <NetworkTab selectedKeyword={selected} networkData={networkData} networkLoading={netLoading}
            onKeywordSelect={(k) => { const n = k.displayName || k.keyword || k; setQuery(n); setSelected(n); setSearched(true); }} />
        )}
      </div>
    </DashboardLayout>
  );
}
