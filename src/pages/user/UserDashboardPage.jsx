import { Search, TrendingUp, Clock } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import RecentSearches from '@/components/ui/RecentSearches';

export default function UserDashboardPage() {
  return (
    <DashboardLayout title="My Dashboard" description="Your personal trend search center.">
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Searches" value="—" icon={Search}     color="text-[#4A90E2]"  bg="bg-[#4A90E2]/10" />
        <StatCard label="Saved Trends"   value="—" icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard label="This Week"      value="—" icon={Clock}     color="text-purple-400" bg="bg-purple-500/10" />
      </div>
      <RecentSearches searches={[]} />
    </DashboardLayout>
  );
}
