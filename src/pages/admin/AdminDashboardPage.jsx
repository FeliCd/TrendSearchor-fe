import { useState, useEffect } from 'react';
import { Users, TrendingUp, BookOpen, Database, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import { dashboardService } from '@/services/dashboardService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const formatNumber = (num) => {
    if (num == null) return '0';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return String(num);
  };

  const statCards = [
    { label: 'Total Users', value: loading ? '...' : formatNumber(stats?.totalUsers), icon: Users, color: 'text-[#0058be]', bg: 'bg-[#0058be]/10' },
    { label: 'Total Publications', value: loading ? '...' : formatNumber(stats?.totalPapers), icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Indexed Topics', value: loading ? '...' : formatNumber(stats?.totalTopics), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Journals', value: loading ? '...' : formatNumber(stats?.totalJournals), icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const apiSyncs = stats?.apiSyncStatuses || [];

  return (
    <DashboardLayout title="Admin Dashboard" description="Platform overview and real-time database synchronization status.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} bg={s.bg} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Data Source Sync Status */}
        <SectionCard title="External Data Sources & Sync Status">
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
            ) : apiSyncs.length === 0 ? (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">No data source stats recorded</p>
            ) : (
              apiSyncs.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-800 bg-[#1e1e1e]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-700 bg-[#151515] flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-[#0058be]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{source.sourceName}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Last sync: {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                      source.lastSyncStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {source.lastSyncStatus === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {source.lastSyncStatus || 'ACTIVE'}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">{formatNumber(source.recordsSynced)} Records</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* Database System Overview */}
        <SectionCard title="Database System Overview">
          <div className="p-4 border-2 border-gray-800 bg-[#1e1e1e] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <span className="text-xs font-bold text-gray-400">Total Keywords / Tags</span>
              <span className="text-sm font-black text-white">{loading ? '...' : formatNumber(stats?.totalKeywords)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <span className="text-xs font-bold text-gray-400">Total Indexed Authors</span>
              <span className="text-sm font-black text-white">{loading ? '...' : formatNumber(stats?.totalAuthors)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <span className="text-xs font-bold text-gray-400">System Role Distribution</span>
              <span className="text-xs font-bold text-emerald-400">STUDENT, RESEARCHER, ADMIN</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">API Health Status</span>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 border border-emerald-500/20">Operational</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
