import SectionCard from '@/components/ui/SectionCard';

export default function ActivityList({ items, avatarField = 'username', actionField = 'action', timeField = 'time', getAvatar, getAction, getTime }) {
  return (
    <SectionCard title="Recent Activity">
      <div className="divide-y divide-white/[0.04]">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center text-[#8b949e] text-sm">No recent activity.</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {getAvatar ? getAvatar(item) : (item[avatarField]?.[0] || '?').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">
                  <span className="font-medium">{getAction ? getAction(item) : item[actionField]}</span>
                </p>
              </div>
              <span className="text-[10px] text-[#8b949e] whitespace-nowrap">
                {getTime ? getTime(item) : item[timeField]}
              </span>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
