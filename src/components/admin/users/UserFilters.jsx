import { Search, RefreshCw, X } from 'lucide-react';
import { ROLES, ROLE_LABELS, USER_STATUS } from '@/constants/roles';
import { motion } from 'framer-motion';
import SelectDropdown from '@/components/ui/SelectDropdown';

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
  action,
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
      className="h-full"
    >
      <div className="flex flex-col justify-between h-full w-full gap-4">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1 w-full min-w-[200px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-10 border-2 text-sm text-white bg-[#1e1e1e] border-gray-800
                placeholder:text-gray-500 focus:outline-none focus:border-[#0058be] transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">

            {/* Role Filter */}
            <SelectDropdown
              value={roleFilter}
              onChange={onRoleFilter}
              options={[
                { value: 'ALL', label: 'All Roles' },
                ...Object.values(ROLES)
                  .filter(r => r !== ROLES.STUDENT)
                  .map(r => ({ value: r, label: r === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[r] }))
              ]}
              className="min-w-[150px]"
            />

            {/* Status Filter */}
            <SelectDropdown
              value={statusFilter}
              onChange={onStatusFilter}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: USER_STATUS.ACTIVE, label: 'Active' },
                { value: USER_STATUS.INACTIVE, label: 'Inactive' },
              ]}
              className="min-w-[140px]"
            />

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 h-11 px-4 border-2 text-[10px] font-black uppercase tracking-widest text-gray-400
                  hover:text-white hover:bg-white/5 border-gray-800 transition-all duration-200"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center justify-center w-11 h-11 border-2 text-gray-400 bg-[#1e1e1e]
                hover:text-white hover:border-gray-700 border-gray-800 transition-all duration-200"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {action && (
          <div className="w-full flex items-center justify-start mt-auto">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}
