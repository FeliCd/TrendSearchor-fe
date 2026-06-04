import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, BookOpen, Bookmark, Loader2, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import SectionCard from '@/components/ui/SectionCard';
import { trendService } from '@/services/trendService';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingRanking, setTrendingRanking] = useState([]);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ranking, keywords] = await Promise.allSettled([
          trendService.getTrendingRanking(6),
          trendService.getTrendingKeywords(5),
        ]);
        if (ranking.status === 'fulfilled') setTrendingRanking(ranking.value || []);
        if (keywords.status === 'fulfilled') setTrendingKeywords(keywords.value || []);
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/academic/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDifficulty = (trendScore) => {
    if (trendScore == null) return { label: 'Medium', color: 'border-amber-500/30 text-amber-400' };
    if (trendScore > 70) return { label: 'Hard', color: 'border-red-500/30 text-red-400' };
    if (trendScore > 40) return { label: 'Medium', color: 'border-amber-500/30 text-amber-400' };
    return { label: 'Easy', color: 'border-emerald-500/30 text-emerald-400' };
  };

  const getGrowthLabel = (rate) => {
    if (rate == null) return 'Medium';
    if (rate > 0.5) return 'Very High';
    if (rate > 0.2) return 'High';
    if (rate > 0) return 'Medium';
    return 'Low';
  };

  const getTrendArrow = (growthRate) => {
    if (growthRate == null) return { arrow: '→', color: 'text-gray-500' };
    if (growthRate > 0.05) return { arrow: '↑', color: 'text-emerald-500' };
    if (growthRate < -0.05) return { arrow: '↓', color: 'text-red-500' };
    return { arrow: '→', color: 'text-gray-500' };
  };

  return (
    <DashboardLayout 
      title="Student Dashboard" 
      description="Start your research journey, discover topics, and find thesis ideas."
    >
      {/* Quick Search Hero */}
      <div className="bg-[#0058be]/5 border-2 border-[#0058be]/30 p-8 md:p-12 mb-8 flex flex-col items-center text-center">
        <Compass className="w-12 h-12 text-[#0058be] mb-6" />
        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Discover Research Topics</h2>
        <p className="text-gray-400 mb-8 max-w-lg">Search through millions of academic papers, or explore our curated roadmaps for beginners.</p>
        
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative flex items-center">
          <Search className="w-5 h-5 text-gray-500 absolute left-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Machine Learning, IoT)..." 
            className="w-full bg-[#1e1e1e] border-2 border-gray-700 text-white pl-12 pr-4 py-4 font-bold focus:outline-none focus:border-[#0058be] transition-colors placeholder:font-normal"
          />
          <button type="submit" className="absolute right-2 px-6 py-2 bg-[#0058be] text-white text-[10px] font-black uppercase tracking-widest border-2 border-[#0058be] hover:bg-[#004a9f] transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Beginner Research Roadmap */}
        <div className="lg:col-span-2">
          <SectionCard title="Beginner Research Roadmap" className="h-full">
            <div className="flex flex-col md:flex-row items-center gap-4 py-4">
              <div className="flex-1 border-2 border-gray-800 p-4 text-center bg-[#1e1e1e] relative">
                <p className="text-sm font-bold text-white mb-2">Statistics</p>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Foundation</span>
                <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-0.5 bg-gray-800" />
                <div className="md:hidden absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gray-800" />
              </div>
              <div className="flex-1 border-2 border-[#0058be]/30 bg-[#0058be]/10 p-4 text-center relative">
                <p className="text-sm font-bold text-white mb-2">Machine Learning</p>
                <span className="text-[10px] text-[#0058be] uppercase tracking-widest font-black">Core</span>
                <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-0.5 bg-gray-800" />
                <div className="md:hidden absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gray-800" />
              </div>
              <div className="flex-1 border-2 border-gray-800 p-4 text-center bg-[#1e1e1e]">
                <p className="text-sm font-bold text-white mb-2">Deep Learning</p>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Advanced</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Research Trend Snapshot */}
        <div className="lg:col-span-1">
          <SectionCard title="Trend Snapshot" className="h-full">
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
              ) : trendingKeywords.length === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No data</p>
              ) : (
                trendingKeywords.slice(0, 5).map((kw, i) => {
                  const { arrow, color } = getTrendArrow(kw.growthRate);
                  return (
                    <div key={i} className="flex justify-between items-center p-3 border-2 border-gray-800 bg-[#1e1e1e]">
                      <span className="font-bold text-white text-sm">{kw.displayName || kw.keyword}</span>
                      <span className={`font-black ${color}`}>{arrow}</span>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Explorer */}
        <SectionCard title="Topic Explorer">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Topic</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Difficulty</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Growth</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="py-6 text-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin inline" /></td></tr>
                ) : trendingRanking.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">No data</td></tr>
                ) : (
                  trendingRanking.map((item, i) => {
                    const diff = getDifficulty(item.trendScore);
                    return (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-4 text-sm font-bold text-white">{item.displayName || item.keyword}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${diff.color}`}>
                            {diff.label}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{getGrowthLabel(item.growthRate)}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Recommended Topics */}
        <SectionCard title="Recommended Research Topics">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : trendingRanking.length === 0 ? (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No suggestions</p>
            ) : (
              trendingRanking.slice(0, 3).map((topic, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-2 border-gray-800 bg-[#1e1e1e] group hover:border-[#0058be]/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-[#151515] border-2 border-gray-800 flex items-center justify-center group-hover:border-[#0058be] transition-colors">
                    <BookOpen className="w-4 h-4 text-[#0058be]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{topic.displayName || topic.keyword}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{topic.statusLabel || 'Trending'}</p>
                  </div>
                  <Bookmark className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
