import SectionCard from '@/components/ui/SectionCard';

export default function ActivityList({ items, avatarField = 'mail', actionField = 'action', timeField = 'time', getAvatar, getAction, getTime }) {
  return (
    <SectionCard title="Recent Activity">
      <div className="divide-y divide-gray-800">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">No recent activity.</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-[var(--dark-bg-base)] border border-gray-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {getAvatar ? getAvatar(item) : (item[avatarField]?.[0] || '?').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">
                  <span className="font-medium">{getAction ? getAction(item) : item[actionField]}</span>
                </p>
              </div>
              <span className="text-[10px] text-gray-500 whitespace-nowrap">
                {getTime ? getTime(item) : item[timeField]}
              </span>
            </div>
          ))
        )
      </div>
    </SectionCard>
  );
}
