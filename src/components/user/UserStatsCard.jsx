import { Activity, Search, Bookmark, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserStatsCard() {
  const stats = [
    { label: 'Total Searches', value: '1,248', icon: Search, bgColor: 'bg-blue-500/[0.08]', borderColor: 'border-blue-500/15', iconColor: 'text-blue-500', textColor: 'text-[#0b1c30]' },
    { label: 'Saved Items', value: '342', icon: Bookmark, bgColor: 'bg-emerald-500/[0.08]', borderColor: 'border-emerald-500/15', iconColor: 'text-emerald-500', textColor: 'text-[#0b1c30]' },
    { label: 'Activity Score', value: '98%', icon: Activity, bgColor: 'bg-orange-500/[0.08]', borderColor: 'border-orange-500/15', iconColor: 'text-orange-500', textColor: 'text-[#0b1c30]' },
  ];

  return (
    <div className="bg-white border border-[#c6c6cd]/60 shadow-sm rounded-2xl p-6 h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-xl px-4 py-3.5 bg-white border border-[#c6c6cd]/40
                hover:border-[#0b1c30]/20 transition-all duration-300 cursor-default shadow-sm`}
            >
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${stat.iconColor.split('-')[1]}-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#76777d] mb-1.5 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} leading-none tracking-tight`}>{stat.value}</p>
                </div>
                <div className={`mt-0.5 w-8 h-8 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] bg-gradient-to-r from-transparent via-black/[0.02] to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
