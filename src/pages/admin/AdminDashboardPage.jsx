import { Users, TrendingUp, Activity, Globe } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import ActivityList from '@/components/ui/ActivityList';

const STATS = [
  { label: 'Total Users',    value: '—', icon: Users,     color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  { label: 'Search Queries', value: '—', icon: Activity,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Active Trends', value: '—', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Countries',     value: '—', icon: Globe,      color: 'text-orange-400',  bg: 'bg-orange-500/10' },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Admin Dashboard" description="Platform overview and recent activity.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} bg={s.bg} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ActivityList items={[]} getAction={(item) => `${item.username} ${item.action}`} />
        <div className="bg-[#0d1117]/60 border border-white/[0.06] rounded-xl">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            {<h2 className="text-sm font-semibold text-white">Search Volume (30 days)</h2>}
          </div>
          <div className="p-5">
            <div className="flex items-end gap-1.5 h-40">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100, 80, 70, 60, 90, 85, 95, 80, 70, 55, 75, 90, 85, 95, 80, 70, 90, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-[#4A90E2]/20 hover:bg-[#4A90E2]/30 rounded-t transition-all" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-[#8b949e]">15 Apr</span>
              <span className="text-[10px] text-[#8b949e]">15 May</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
