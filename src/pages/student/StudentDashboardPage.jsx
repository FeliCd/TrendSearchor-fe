import { useState, useEffect } from 'react';
import { Search, TrendingUp, BookOpen, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import TrendList from '@/components/ui/TrendList';

export default function StudentDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    dashboardService.getUserDashboard()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load dashboard:', err);
          setStats({});
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <DashboardLayout title="Student Dashboard" description="Track your courses and explore research trends.">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#0058be] animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <StatCard label="Papers Indexed" value={stats?.totalPapers?.toLocaleString() || '—'} icon={BookOpen} color="text-[#0058be]" bg="bg-[#0058be]/10" />
            <StatCard label="Trending Keywords" value={stats?.totalKeywords?.toLocaleString() || '—'} icon={TrendingUp} color="text-[#0058be]" bg="bg-[#0058be]/10" />
            <StatCard label="Journals" value={stats?.totalJournals?.toLocaleString() || '—'} icon={Search} color="text-[#0058be]" bg="bg-[#0058be]/10" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <TrendList trends={stats?.topKeywords || []} />
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Latest Publication Activity</h3>
              <div className="space-y-3">
                {(stats?.yearlyStats || []).slice(-5).map((year, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[var(--dark-bg-base)] rounded-xl border border-gray-800">
                    <span className="text-gray-300">{year.year}</span>
                    <span className="text-[#0058be] font-semibold">{year.paperCount?.toLocaleString() || 0} papers</span>
                  </div>
                ))}
                {(!stats?.yearlyStats || stats.yearlyStats.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-8">No data yet. Explore trending keywords.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
