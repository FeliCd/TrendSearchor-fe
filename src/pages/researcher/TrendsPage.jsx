import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BarChart2, Loader2, Bookmark, TrendingDown, Minus, CheckCircle, XCircle } from 'lucide-react';
import { trendService } from '@/services/trendService';
import { bookmarkService } from '@/services/bookmarkService';
import StatCard from '@/components/ui/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TrendsPage() {
  const [keywords, setKeywords] = useState([]);
  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState(new Set());
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareKeywords, setCompareKeywords] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadKeywords = useCallback(async () => {
    try {
      const data = await trendService.getTrendingKeywords(50);
      setKeywords(data);
      if (data.length > 0 && !selectedKeyword) {
        setSelectedKeyword(data[0].keyword);
      }
    } catch (err) {
      console.error('Failed to load keywords:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrendData = useCallback(async (keyword) => {
    if (!keyword) return;
    try {
      const data = await trendService.getKeywordTrend(keyword);
      setTrendData(data || []);
    } catch (err) {
      console.error('Failed to load trend:', err);
    }
  }, []);

  useEffect(() => {
    loadKeywords();
  }, [loadKeywords]);

  useEffect(() => {
    if (selectedKeyword) {
      loadTrendData(selectedKeyword);
    }
  }, [selectedKeyword, loadTrendData]);

  const handleCompareToggle = (keyword) => {
    setCompareKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      }
      if (prev.length >= 4) return prev;
      return [...prev, keyword];
    });
  };

  const handleKeywordBookmark = async (kw) => {
    if (!kw.id) {
      showToast('Cannot bookmark: keyword not yet saved to database', 'error');
      return;
    }
    const isCurrentlyBookmarked = bookmarkedKeywordIds.has(kw.id);
    setBookmarkedKeywordIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) next.delete(kw.id);
      else next.add(kw.id);
      return next;
    });
    try {
      if (isCurrentlyBookmarked) {
        await bookmarkService.removeKeywordBookmark(kw.id);
        showToast(`"${kw.displayName || kw.keyword}" removed from bookmarks`);
      } else {
        await bookmarkService.addKeywordBookmark(kw.id);
        showToast(`"${kw.displayName || kw.keyword}" added to bookmarks`);
      }
    } catch (err) {
      setBookmarkedKeywordIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) next.add(kw.id);
        else next.delete(kw.id);
        return next;
      });
      showToast(err?.response?.data?.message || 'Failed to update bookmark', 'error');
    }
  };

  const getTrendIcon = (rate) => {
    if (rate > 0.1) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (rate < -0.1) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#010409]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] p-6">
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Research Trends</h1>
          <p className="text-gray-400">Explore trending research topics and publication patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Trending Keywords</h2>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  compareMode ? 'bg-[#4A90E2] text-white' : 'bg-[#0d1117] text-gray-400'
                }`}
              >
                {compareMode ? 'Comparing...' : 'Compare'}
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {keywords.map((kw) => {
                const isBookmarked = bookmarkedKeywordIds.has(kw.id);
                return (
                  <div
                    key={kw.keyword}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedKeyword === kw.keyword
                        ? 'bg-[#4A90E2]/20 border border-[#4A90E2]/40'
                        : 'bg-[#0d1117] border border-transparent hover:bg-[#0d1117]/80'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedKeyword(kw.keyword)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {kw.displayName || kw.keyword}
                        </span>
                        {compareMode && (
                          <input
                            type="checkbox"
                            checked={compareKeywords.includes(kw.keyword)}
                            onChange={() => handleCompareToggle(kw.keyword)}
                            className="w-4 h-4 accent-[#4A90E2] flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getTrendIcon(kw.growthRate)}
                        <span className="text-xs text-gray-500">
                          {kw.paperCount?.toLocaleString() || 0} papers
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleKeywordBookmark(kw)}
                      className={`p-1.5 rounded-md transition-all flex-shrink-0 ${
                        isBookmarked
                          ? 'text-[#4A90E2] bg-[#4A90E2]/10'
                          : 'text-gray-500 hover:text-[#4A90E2] hover:bg-[#4A90E2]/10'
                      }`}
                      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#161b22] border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">
              Publication Trend: {selectedKeyword}
            </h2>

            {trendData.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-end gap-2 h-64">
                  {trendData.map((item, i) => {
                    const maxCount = Math.max(...trendData.map(d => d.paperCount || 0));
                    const height = maxCount > 0 ? ((item.paperCount || 0) / maxCount) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-[#4A90E2] to-[#4A90E2]/50 rounded-t-md transition-all hover:from-[#5A9EF2] cursor-pointer"
                          style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                          title={`${item.paperCount} papers`}
                        />
                        <span className="text-xs text-gray-500">{item.year}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <StatCard
                    label="Total Papers"
                    value={trendData.reduce((sum, d) => sum + (d.paperCount || 0), 0).toLocaleString()}
                    color="blue"
                  />
                  <StatCard
                    label="Total Citations"
                    value={trendData.reduce((sum, d) => sum + (d.citationCount || 0), 0).toLocaleString()}
                    color="purple"
                  />
                  <StatCard
                    label="Years Tracked"
                    value={trendData.length.toString()}
                    color="green"
                  />
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-400 font-medium">Year</th>
                        <th className="text-right py-2 px-3 text-gray-400 font-medium">Papers</th>
                        <th className="text-right py-2 px-3 text-gray-400 font-medium">Citations</th>
                        <th className="text-right py-2 px-3 text-gray-400 font-medium">Avg Citations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendData.map((item, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-3 text-white">{item.year}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{item.paperCount}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{item.citationCount}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{item.avgCitations?.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <BarChart2 className="w-12 h-12 mb-3 opacity-30" />
                <p>No trend data available for this keyword</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
