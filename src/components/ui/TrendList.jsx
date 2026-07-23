import { TrendingUp } from 'lucide-react';
import SectionCard from '@/components/ui/SectionCard';

export default function TrendList({ trends }) {
  return (
    <SectionCard title="Trending Keywords" className="h-full">
      <div className="divide-y divide-gray-800">
        {trends.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">No trending keywords.</div>
        ) : (
          trends.map((trend) => (
            <div key={trend.keyword || trend.title} className="flex items-center gap-4 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className="w-10 h-10 border-2 bg-[#0058be]/10 border-[#0058be]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#0058be]/50 transition-colors">
                <TrendingUp className="w-4 h-4 text-[#0058be]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-bold truncate mb-1">{trend.displayName || trend.keyword || trend.title}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  {trend.category || trend.keyword || 'Keyword'}
                  {trend.paperCount != null ? ` · ${Number(trend.paperCount).toLocaleString()} PAPERS` : ''}
                  {trend.growthRate != null && trend.growthRate > 0 ? ` · ↑ ${(trend.growthRate * 100).toFixed(1)}%` : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
