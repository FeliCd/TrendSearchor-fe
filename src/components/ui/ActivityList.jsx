import SectionCard from '@/components/ui/SectionCard';

export default function ActivityList({ items, avatarField = 'mail', actionField = 'action', timeField = 'time', getAvatar, getAction, getTime }) {
  return (
    <SectionCard title="Recent Activity" className="h-full">
      <div className="divide-y divide-gray-800">
        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">No recent activity.</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className="w-10 h-10 bg-[#151515] border-2 border-gray-800 flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-gray-400 flex-shrink-0 group-hover:border-gray-600 group-hover:text-white transition-colors">
                {getAvatar ? getAvatar(item) : (item[avatarField]?.[0] || '?')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">
                  {getAction ? getAction(item) : item[actionField]}
                </p>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold whitespace-nowrap">
                {getTime ? getTime(item) : item[timeField]}
              </span>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
