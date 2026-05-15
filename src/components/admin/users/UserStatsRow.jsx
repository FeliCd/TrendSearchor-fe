import { ROLES, USER_STATUS } from '@/constants/roles';

const STAT_CONFIG = [
  { key: 'total',    label: 'Total Users',   color: 'text-white' },
  { key: ROLES.ADMIN,        label: 'Admins',      color: 'text-red-400' },
  { key: ROLES.LECTURER,     label: 'Lecturers',   color: 'text-emerald-400' },
  { key: ROLES.STUDENT,      label: 'Students',    color: 'text-blue-400' },
  { key: ROLES.RESEARCHER,   label: 'Researchers', color: 'text-purple-400' },
  { key: USER_STATUS.ACTIVE, label: 'Active',      color: 'text-emerald-400' },
];

function buildStats(users) {
  return STAT_CONFIG.map(({ key, label, color }) => ({
    label,
    value:
      key === 'total'
        ? users.length
        : users.filter((u) => u.role === key || (key === USER_STATUS.ACTIVE && u.status === key)).length,
    color,
  }));
}

export default function UserStatsRow({ users }) {
  const stats = buildStats(users);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#0d1117]/60 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1">{stat.label}</p>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
