import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Network, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import { dashboardService } from '@/services/dashboardService';
import { trendService } from '@/services/trendService';

export default function LecturerDashboard() {
  const [stats, setStats] = useState(null);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [trendingRanking, setTrendingRanking] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashData, keywords, ranking, yearly] = await Promise.allSettled([
          dashboardService.getUserDashboard(),
          trendService.getTrendingKeywords(10),
          trendService.getTrendingRanking(5),
          trendService.getYearlyStats(),
        ]);
        if (dashData.status === 'fulfilled') setStats(dashData.value);
        if (keywords.status === 'fulfilled') setTrendingKeywords(keywords.value || []);
        if (ranking.status === 'fulfilled') setTrendingRanking(ranking.value || []);
        if (yearly.status === 'fulfilled') setYearlyStats(yearly.value || []);
      } catch (err) {
        console.error('Lecturer dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatNumber = (num) => {
    if (num == null) return '0';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return String(num);
  };

  const getTrendIcon = (growthRate) => {
    if (growthRate == null) return 'stable';
    if (growthRate > 0.05) return 'up';
    if (growthRate < -0.05) return 'down';
    return 'stable';
  };

  const maxBar = yearlyStats.length > 0 ? Math.max(...yearlyStats.map(y => y.paperCount || 0)) : 1;

  return (
    <DashboardLayout 
      title="Lecturer Dashboard" 
      description="Track research directions, discover teaching trends, and guide students."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Authors" value={loading ? '...' : formatNumber(stats?.totalAuthors)} icon={Users} color="text-[#0058be]" bg="bg-[#0058be]/10" />
        <StatCard label="Active Domains" value={loading ? '...' : formatNumber(stats?.totalKeywords)} icon={Network} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard label="Total Publications" value={loading ? '...' : formatNumber(stats?.totalPapers)} icon={BookOpen} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard label="Indexed Journals" value={loading ? '...' : formatNumber(stats?.totalJournals)} icon={TrendingUp} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Domain Analytics */}
        <div className="lg:col-span-1">
          <SectionCard title="Domain Analytics" className="h-full">
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
              ) : trendingKeywords.length === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No domain data</p>
              ) : (
                trendingKeywords.slice(0, 8).map((kw, i) => {
                  const trend = getTrendIcon(kw.growthRate);
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b-2 border-gray-800 last:border-0">
                      <span className="text-sm text-white font-bold truncate pr-2">{kw.displayName || kw.keyword}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-widest text-gray-500">{kw.paperCount || 0}</span>
                        {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                        {trend === 'stable' && <div className="w-4 h-px bg-gray-500" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>

        {/* Teaching-Relevant Trends */}
        <div className="lg:col-span-2">
          <SectionCard title="Teaching-Relevant Trends" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-3 flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
              ) : trendingRanking.length === 0 ? (
                <p className="col-span-3 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No trending data</p>
              ) : (
                trendingRanking.slice(0, 3).map((trend, i) => (
                  <div key={i} className="border-2 border-gray-800 p-4 bg-[#1e1e1e] hover:border-gray-600 transition-colors">
                    <div className="w-8 h-8 border-2 border-amber-500/30 bg-amber-500/10 flex items-center justify-center mb-3">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                    </div>
                    <h4 className="text-white font-bold mb-1">{trend.displayName || trend.keyword}</h4>
                    <p className="text-xs text-gray-400 mb-3">{trend.statusLabel || 'Trending'}</p>
                    <span className="inline-block px-2 py-1 bg-gray-800 text-[10px] uppercase tracking-widest font-black text-gray-300">
                      {trend.recentPapers || 0} Recent Papers
                    </span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thesis Suggestions from emerging topics */}
        <SectionCard title="Research Topic Suggestions">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : trendingRanking.length === 0 ? (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No suggestions</p>
            ) : (
              trendingRanking.slice(0, 3).map((topic, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-2 border-gray-800 bg-[#1e1e1e] group hover:border-[#0058be]/50 transition-colors">
                  <div className="w-10 h-10 bg-[#151515] border-2 border-gray-800 flex items-center justify-center group-hover:border-[#0058be] transition-colors">
                    <Lightbulb className="w-4 h-4 text-[#0058be]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{topic.displayName || topic.keyword}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{topic.totalPapers || 0} total papers</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                    topic.status === 'EMERGING' ? 'border-amber-500/30 text-amber-400' 
                    : topic.status === 'HOT' ? 'border-red-500/30 text-red-400' 
                    : 'border-emerald-500/30 text-emerald-400'
                  }`}>
                    {topic.statusLabel || topic.status || 'Active'}
                  </span>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* Publication Monitoring */}
        <SectionCard title="Publication Monitoring">
          <div className="flex h-full items-end gap-2 pt-8 pb-4">
            {loading ? (
              <div className="flex-1 flex justify-center items-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : yearlyStats.length === 0 ? (
              <div className="flex-1 flex justify-center items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">No data</span>
              </div>
            ) : (
              yearlyStats.slice(-5).map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{data.paperCount}</span>
                  <div 
                    className="w-full bg-[#0058be] border-2 border-[#0058be] group-hover:bg-[#004a9f] transition-colors"
                    style={{ height: `${Math.max((data.paperCount / maxBar) * 80, 4)}px` }}
                  />
                  <span className="text-[10px] font-black text-gray-500">{data.year}</span>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
