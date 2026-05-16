import { TrendingUp } from 'lucide-react';
import SectionCard from '@/components/ui/SectionCard';

export default function TrendList({ trends }) {
  return (
    <SectionCard title="Trending Keywords">
      <div className="divide-y divide-white/[0.04]">
        {trends.length === 0 ? (
          <div className="px-5 py-10 text-center text-[#8b949e] text-sm">No trending keywords.</div>
        ) : (
          trends.map((trend) => (
            <div key={trend.keyword || trend.title} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{trend.displayName || trend.keyword || trend.title}</p>
                <p className="text-[10px] text-[#8b949e]">
                  {trend.category || trend.keyword || 'Keyword'}
                  {trend.paperCount != null ? ` · ${Number(trend.paperCount).toLocaleString()} papers` : ''}
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
