import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Layers, BookOpen, TrendingUp, Map, Target, ArrowUpRight, Zap, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import { dashboardService } from '@/services/dashboardService';
import { trendService } from '@/services/trendService';
import ResearcherLeaderboardWidget from '@/components/dashboard/ResearcherLeaderboardWidget';

function TimelineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e1e1e] border-2 border-gray-800 px-3 py-2 shadow-2xl">
      <p className="text-xs font-black uppercase tracking-widest text-[#5ba3ff] mb-1">Year {label}</p>
      <div className="flex items-center gap-2 text-xs font-bold text-white">
        <div className="w-2 h-2 rounded-full bg-[#0058be]" />
        <span>Publications:</span>
        <span className="text-[#5ba3ff] font-black">{payload[0].value?.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function ResearcherDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [emergingTopics, setEmergingTopics] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashData, trending, emerging, yearly] = await Promise.allSettled([
          dashboardService.getUserDashboard(),
          trendService.getTrendingRanking(3),
          trendService.getEmergingTopics(3),
          trendService.getYearlyStats(),
        ]);
        if (dashData.status === 'fulfilled') setStats(dashData.value);
        if (trending.status === 'fulfilled') setTrendingTopics(trending.value || []);
        if (emerging.status === 'fulfilled') setEmergingTopics(emerging.value || []);
        if (yearly.status === 'fulfilled') setYearlyStats(yearly.value || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
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

  const formatGrowth = (rate) => {
    if (rate == null) return '—';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${(rate * 100).toFixed(0)}%`;
  };

  return (
    <DashboardLayout 
      title="Trend Intelligence" 
      description="Discover emerging research, analyze publication trends, and find your next research direction."
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Publications" value={loading ? '...' : formatNumber(stats?.totalPapers)} icon={Database} color="text-[#0058be]" bg="bg-[#0058be]/10" />
        <StatCard label="Indexed Journals" value={loading ? '...' : formatNumber(stats?.totalJournals)} icon={BookOpen} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard label="Research Domains" value={loading ? '...' : formatNumber(stats?.totalKeywords)} icon={Layers} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard label="Total Authors" value={loading ? '...' : formatNumber(stats?.totalAuthors)} icon={TrendingUp} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trend Timeline Chart */}
        <div className="lg:col-span-2">
          <SectionCard title="Publication Trend Timeline" className="h-full">
            <div className="flex flex-col h-full justify-center">
              {yearlyStats.length === 0 ? (
                <div className="flex-1 flex items-center justify-center min-h-[220px] border-2 border-gray-800 bg-[#1e1e1e]">
                  {loading ? <Loader2 className="w-6 h-6 text-gray-500 animate-spin" /> : <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">No data available</span>}
                </div>
              ) : (
                <div className="p-2 border-2 border-gray-800 bg-[#1e1e1e]">
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart 
                      data={yearlyStats.filter(y => y.year >= 2010).length > 0 ? yearlyStats.filter(y => y.year >= 2010) : yearlyStats} 
                      margin={{ top: 15, right: 15, bottom: 5, left: -20 }}
                    >
                      <defs>
                        <linearGradient id="publicationGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0058be" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0058be" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} tickLine={false} axisLine={{ stroke: '#ffffff15' }} />
                      <YAxis domain={[0, 'dataMax + 2']} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<TimelineTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="paperCount"
                        name="Publications"
                        stroke="#0058be"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#publicationGrad)"
                        dot={{ r: 5, fill: '#0058be', stroke: '#5ba3ff', strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: '#5ba3ff', stroke: '#0058be', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Trending Topics & Emerging */}
        <div className="space-y-6">
          <SectionCard title="Trending Topics">
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
              ) : trendingTopics.length === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No trending data</p>
              ) : (
                trendingTopics.slice(0, 3).map((topic, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/researcher/trends?q=${encodeURIComponent(topic.keyword || topic.displayName)}`)}
                    className="flex items-center justify-between p-3 border-2 border-gray-800 bg-[#1e1e1e] hover:border-[#0058be] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white truncate pr-2">{topic.displayName || topic.keyword}</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 border-2 border-emerald-500/20 shrink-0">{formatGrowth(topic.growthRate)}</span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
          
          <SectionCard title="Emerging Topics">
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
              ) : emergingTopics.length === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No emerging data</p>
              ) : (
                emergingTopics.slice(0, 3).map((topic, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/researcher/trends?q=${encodeURIComponent(topic.keyword || topic.displayName)}`)}
                    className="flex items-center gap-3 p-3 border-2 border-gray-800 bg-[#1e1e1e] hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center border-2 border-amber-500/30 bg-amber-500/10 shrink-0">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white truncate">{topic.displayName || topic.keyword}</h4>
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{topic.statusLabel || 'Emerging'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Journals */}
        <SectionCard title="Top Journals">
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : (stats?.topJournals || []).length === 0 ? (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No journal data</p>
            ) : (
              (stats?.topJournals || []).slice(0, 3).map((journal, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/researcher/search?q=${encodeURIComponent(journal.name)}`)}
                  className="flex items-center justify-between p-3 border-2 border-gray-800 bg-[#1e1e1e] hover:border-[#0058be] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-white truncate">{journal.name}</p>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mt-1">{journal.paperCount || 0} Pubs</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-widest font-black text-[#0058be] mb-0.5">Papers</p>
                    <p className="text-lg font-black text-white">{journal.paperCount || 0}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* Geographic Research Map */}
        <SectionCard title="Geographic Research Map">
          <div className="flex items-center gap-6 h-full p-4 border-2 border-gray-800 bg-[#1e1e1e]">
            <div className="w-24 h-24 border-2 border-gray-700 bg-[#151515] flex items-center justify-center shrink-0">
              <Map className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">United States</span>
                <span className="text-xs font-black text-emerald-400">+12%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 mb-4"><div className="h-full bg-[#0058be] w-[80%]" /></div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">China</span>
                <span className="text-xs font-black text-emerald-400">+18%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 mb-4"><div className="h-full bg-[#0058be] w-[75%]" /></div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">Germany</span>
                <span className="text-xs font-black text-emerald-400">+5%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800"><div className="h-full bg-[#0058be] w-[45%]" /></div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SectionCard title="Recommendation Feed" className="h-full">
            <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Target className="w-3 h-3 text-[#0058be]" /> Based on trending topics
            </div>
            <div className="space-y-3">
              {(trendingTopics.length > 0 ? trendingTopics.slice(0, 3) : [{keyword: 'AI Safety'}, {keyword: 'Human-AI Collaboration'}, {keyword: 'Autonomous Agents'}]).map((topic, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/researcher/trends?q=${encodeURIComponent(topic.keyword || topic.displayName)}`)}
                  className="flex items-center justify-between p-3 border-2 border-gray-800 bg-[#1e1e1e] group hover:border-[#0058be] transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-white truncate pr-2">{topic.displayName || topic.keyword}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-[#0058be] transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <ResearcherLeaderboardWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
