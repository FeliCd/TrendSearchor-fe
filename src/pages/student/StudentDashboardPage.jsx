import { Search, TrendingUp, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import RecentSearches from '@/components/ui/RecentSearches';
import SectionCard from '@/components/ui/SectionCard';

export default function StudentDashboardPage() {
  return (
    <DashboardLayout title="Student Dashboard" description="Track your courses and explore research trends.">
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Courses"          value="—" icon={BookOpen}   color="text-blue-400"    bg="bg-blue-500/10" />
        <StatCard label="Tracked Trends"      value="—" icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard label="Searches This Week"  value="—" icon={Search}    color="text-purple-400" bg="bg-purple-500/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="My Courses">
          <div className="divide-y divide-white/[0.04]">
            <div className="px-5 py-12 text-center text-[#8b949e] text-sm">No courses enrolled yet.</div>
          </div>
        </SectionCard>
        <RecentSearches searches={[]} />
      </div>
    </DashboardLayout>
  );
}
