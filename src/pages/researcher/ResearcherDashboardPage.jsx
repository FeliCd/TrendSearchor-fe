import { Search, TrendingUp, BarChart2, Activity } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import RecentSearches from '@/components/ui/RecentSearches';
import TrendList from '@/components/ui/TrendList';

export default function ResearcherDashboardPage() {
  return (
    <DashboardLayout title="Researcher Dashboard" description="Advanced analytics and trend tracking.">
      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Saved Searches"     value="—" icon={Search}     color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard label="Tracked Trends"     value="—" icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard label="Papers Analyzed"    value="—" icon={BarChart2}  color="text-blue-400"   bg="bg-blue-500/10" />
        <StatCard label="Citations Tracked"  value="—" icon={Activity}   color="text-orange-400" bg="bg-orange-500/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <TrendList trends={[]} />
        <RecentSearches searches={[]} />
      </div>
    </DashboardLayout>
  );
}
