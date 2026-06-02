import { motion } from 'framer-motion';
import { ROLES, USER_STATUS } from '@/constants/roles';
import { Users, ShieldCheck, GraduationCap, FlaskConical, UserCheck, UserX } from 'lucide-react';

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total Users',
    icon: Users,
    bgColor: 'bg-[#0058be]/10',
    borderColor: 'border-[#0058be]/20',
    iconColor: 'text-[#0058be]',
    textColor: 'text-white',
    glow: 'shadow-[#0058be]/10',
  },
  {
    key: ROLES.ADMIN,
    label: 'Admins',
    icon: ShieldCheck,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
    textColor: 'text-white',
    glow: 'shadow-red-500/10',
  },
  {
    key: USER_STATUS.ACTIVE,
    label: 'Active',
    icon: UserCheck,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  {
    key: USER_STATUS.INACTIVE,
    label: 'Inactive',
    icon: UserX,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400',
    glow: 'shadow-yellow-500/10',
  },
];

function buildStats(users, allUsers) {
  return STAT_CONFIG.map((config) => {
    let value;
    if (config.key === 'total') {
      value = allUsers.length;
    } else if (config.key === USER_STATUS.ACTIVE || config.key === USER_STATUS.INACTIVE) {
      value = users.filter((u) => u.status === config.key).length;
    } else {
      value = users.filter((u) => u.role === config.key).length;
    }
    return { ...config, value };
  });
}

export default function UserStatsRow({ users, allUsers }) {
  const stats = buildStats(users, allUsers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-2xl px-4 py-3.5 bg-[var(--dark-bg-elevated)] border border-gray-800
              hover:border-gray-700 transition-all duration-300 cursor-default shadow-sm`}
          >
            {/* Subtle top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current/${stat.iconColor.includes('blue') ? '#0058be' : stat.iconColor.includes('red') ? 'red' : stat.iconColor.includes('emerald') ? 'emerald' : stat.iconColor.includes('purple') ? 'purple' : 'yellow'}-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor} leading-none tracking-tight`}>
                  {stat.value}
                </p>
              </div>
              <div className={`mt-0.5 w-8 h-8 rounded-xl ${stat.bgColor} border ${stat.borderColor}
                flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200`}>
                <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
