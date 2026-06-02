import { Activity, Search, Bookmark, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserStatsCard() {
  const stats = [
    { label: 'Total Searches', value: '1,248', icon: Search, bgColor: 'bg-[#0058be]/10', borderColor: 'border-[#0058be]/20', iconColor: 'text-[#0058be]' },
    { label: 'Saved Items', value: '342', icon: Bookmark, bgColor: 'bg-[#0058be]/10', borderColor: 'border-[#0058be]/20', iconColor: 'text-[#0058be]' },
    { label: 'Activity Score', value: '98%', icon: Activity, bgColor: 'bg-[#0058be]/10', borderColor: 'border-[#0058be]/20', iconColor: 'text-[#0058be]' },
  ];

  return (
    <div className="bg-[var(--dark-bg-base)] border border-gray-800 shadow-sm rounded-2xl p-6 h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl px-4 py-3.5 border border-gray-800
                hover:border-gray-700 transition-all duration-300 cursor-default bg-[var(--dark-bg-base)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white leading-none tracking-tight">{stat.value}</p>
                </div>
                <div className={`mt-0.5 w-8 h-8 rounded-xl bg-[var(--dark-bg-base)] border border-gray-800 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
