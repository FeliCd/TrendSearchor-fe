import { Search, RefreshCw, X, SlidersHorizontal } from 'lucide-react';
import { ROLES, ROLE_LABELS, USER_STATUS } from '@/constants/roles';
import { motion } from 'framer-motion';

export default function UserFilters({
  search,
  onSearch,
  roleFilter,
  onRoleFilter,
  statusFilter,
  onStatusFilter,
  onRefresh,
  refreshing,
  resultCount = 0,
  totalCount = 0,
}) {
  const hasActiveFilters = search || roleFilter !== 'ALL' || statusFilter !== 'ALL';

  const clearAll = () => {
    onSearch('');
    onRoleFilter('ALL');
    onStatusFilter('ALL');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-2xl bg-[#0d1117]/70 border border-white/[0.06] backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 w-full min-w-[200px]">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-[#8b949e]" />
          </div>
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white bg-[#161b22]/80 border border-white/[0.08]
              placeholder:text-[#484f58] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10
              transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-[#8b949e] hidden lg:block" />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl text-sm text-white bg-[#161b22]/80 border border-white/[0.08]
              focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10
              cursor-pointer transition-all hover:bg-[#161b22] min-w-[130px]
              [&>option]:bg-[#161b22] [&>option]:text-white"
          >
            <option value="ALL">All Roles</option>
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl text-sm text-white bg-[#161b22]/80 border border-white/[0.08]
              focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10
              cursor-pointer transition-all hover:bg-[#161b22] min-w-[130px]
              [&>option]:bg-[#161b22] [&>option]:text-white"
          >
            <option value="ALL">All Status</option>
            <option value={USER_STATUS.ACTIVE}>Active</option>
            <option value={USER_STATUS.INACTIVE}>Inactive</option>
            <option value={USER_STATUS.SUSPENDED}>Suspended</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#8b949e]
                hover:text-white hover:bg-white/5 border border-white/[0.08] transition-all duration-200"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-[#8b949e]
              hover:text-white hover:bg-white/5 border border-white/[0.08] transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Result count bar */}
      {totalCount > 0 && (
        <div className="mt-2.5 px-1.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
            <span className="text-xs text-[#8b949e]">
              {hasActiveFilters ? (
                <>
                  Showing <span className="text-[#c9d1d9] font-medium">{resultCount}</span>{' '}
                  of <span className="text-[#c9d1d9] font-medium">{totalCount}</span> users
                </>
              ) : (
                <>
                  <span className="text-[#c9d1d9] font-medium">{totalCount}</span> total users
                </>
              )}
            </span>
          </div>
          {hasActiveFilters && (
            <span className="text-[#484f58] text-xs">|</span>
          )}
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors">
              Reset filters
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
