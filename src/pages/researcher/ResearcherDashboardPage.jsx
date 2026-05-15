import { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart2, Activity, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import TrendList from '@/components/ui/TrendList';

export default function ResearcherDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardService.getUserDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <DashboardLayout title="Researcher Dashboard" description="Advanced analytics and trend tracking.">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Papers" value={stats?.totalPapers?.toLocaleString() || '—'} icon={Search} color="text-purple-400" bg="bg-purple-500/10" />
            <StatCard label="Tracked Keywords" value={stats?.totalKeywords?.toLocaleString() || '—'} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" />
            <StatCard label="Journals Indexed" value={stats?.totalJournals?.toLocaleString() || '—'} icon={BarChart2} color="text-blue-400" bg="bg-blue-500/10" />
            <StatCard label="Authors" value={stats?.totalAuthors?.toLocaleString() || '—'} icon={Activity} color="text-orange-400" bg="bg-orange-500/10" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <TrendList trends={stats?.topKeywords || []} />
            <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Yearly Publication Stats</h3>
              <div className="space-y-3">
                {(stats?.yearlyStats || []).slice(-5).map((year, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[#0d1117] rounded-lg">
                    <span className="text-gray-300">{year.year}</span>
                    <span className="text-[#4A90E2] font-semibold">{year.paperCount?.toLocaleString() || 0} papers</span>
                  </div>
                ))}
                {(!stats?.yearlyStats || stats.yearlyStats.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-8">No data available yet. Sync data from Semantic Scholar.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
