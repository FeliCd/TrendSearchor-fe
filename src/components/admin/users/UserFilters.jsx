import { Search, Filter, RefreshCw } from 'lucide-react';
import { ROLES, ROLE_LABELS, USER_STATUS } from '@/constants/roles';

export default function UserFilters({ search, onSearch, roleFilter, onRoleFilter, statusFilter, onStatusFilter, onRefresh, refreshing }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
      <div className="relative flex-1 w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => { onSearch(e.target.value); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border border-white/[0.08]
            placeholder:text-[#8b949e]/60 focus:outline-none focus:border-[#4A90E2]/50
            focus:bg-[#161b22]/95 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#8b949e]" />
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border border-white/[0.08]
            focus:outline-none focus:border-[#4A90E2]/50 cursor-pointer transition-all appearance-none"
        >
          <option value="ALL">All Roles</option>
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
        className="px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border border-white/[0.08]
          focus:outline-none focus:border-[#4A90E2]/50 cursor-pointer transition-all appearance-none"
      >
        <option value="ALL">All Status</option>
        <option value={USER_STATUS.ACTIVE}>Active</option>
        <option value={USER_STATUS.INACTIVE}>Inactive</option>
        <option value={USER_STATUS.SUSPENDED}>Suspended</option>
      </select>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#8b949e]
          hover:text-white hover:bg-white/5 border border-white/[0.08] transition-all"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
