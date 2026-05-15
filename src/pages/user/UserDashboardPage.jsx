import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import TrendList from '@/components/ui/TrendList';

export default function UserDashboardPage() {
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
    <DashboardLayout title="My Dashboard" description="Your personal trend search center.">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <StatCard label="Papers Indexed" value={stats?.totalPapers?.toLocaleString() || '—'} icon={Search} color="text-[#4A90E2]" bg="bg-[#4A90E2]/10" />
            <StatCard label="Trending Keywords" value={stats?.totalKeywords?.toLocaleString() || '—'} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" />
            <StatCard label="Journals" value={stats?.totalJournals?.toLocaleString() || '—'} icon={Clock} color="text-purple-400" bg="bg-purple-500/10" />
          </div>
          <TrendList trends={stats?.topKeywords || []} />
        </>
      )}
    </DashboardLayout>
  );
}
