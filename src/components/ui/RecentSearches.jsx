import { Search } from 'lucide-react';
import SectionCard from '@/components/ui/SectionCard';

export default function RecentSearches({ searches }) {
  return (
    <SectionCard title="Recent Searches">
      <div className="divide-y divide-white/[0.04]">
        {searches.length === 0 ? (
          <div className="px-5 py-10 text-center text-[#8b949e] text-sm">No recent searches.</div>
        ) : (
          searches.map((item) => (
            <div key={item.term} className="flex items-center gap-3 px-5 py-3">
              <div className="w-6 h-6 rounded-md bg-[#4A90E2]/10 border border-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                <Search className="w-3 h-3 text-[#4A90E2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.term}</p>
                {item.results != null && (
                  <p className="text-[10px] text-[#8b949e]">{item.results} results</p>
                )}
              </div>
              {item.saved && (
                <span className="text-[10px] text-yellow-400">★</span>
              )}
              <span className="text-[10px] text-[#8b949e] whitespace-nowrap">{item.time}</span>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
