import { useState, useEffect, useRef } from 'react';
import { Users, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';
import { formatDate, timeAgo } from '@/utils/dateUtils';
import UserAvatar from '@/components/ui/UserAvatar';
import RoleIcon from '@/components/ui/RoleIcon';

const ITEMS_PER_PAGE = 5;
const COLUMNS = ['', 'User', 'Phone', 'Date of Birth', 'Role', 'Status', 'Last Login', 'Created', 'Actions'];
const STATUS_DOT = { ACTIVE: 'bg-emerald-400', INACTIVE: 'bg-yellow-400' };
const STATUS_LABEL = { ACTIVE: 'Active', INACTIVE: 'Inactive' };

function Pagination({ currentPage, totalPages, users, onPageChange }) {
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1 || page === 2 || page === totalPages - 1);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-gray-800">
      <p className="text-xs text-gray-400">Showing <span className="text-white font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, users.length)}</span> of <span className="text-white font-semibold">{users.length}</span> users</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">Prev</button>
        {pageNums.map((page, idx) => {
          const prev = pageNums[idx - 1];
          return (<span key={page} className="flex items-center">
            {prev && page - prev > 1 && <span className="px-1.5 text-xs text-gray-700">...</span>}
            <button onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${page === currentPage ? 'bg-[#0058be] text-white border-[#0058be] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}>
              {page}
            </button>
          </span>);
        })}
        <button onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">Next</button>
      </div>
    </div>
  );
}

export default function UserTable({ users, onEdit, onView, onDelete, selectedIds = [], onSelect, onSelectAll }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [users.length]);

  const selectableUsers = paginatedUsers.filter((u) => u.role !== ROLES.ADMIN);
  const allSelected = selectableUsers.length > 0 && selectableUsers.every((u) => selectedIds.includes(u.id));
  const someSelected = selectableUsers.some((u) => selectedIds.includes(u.id));

  const handleSelectAll = (e) => {
    if (onSelectAll) {
      const ids = selectableUsers.map((u) => u.id);
      onSelectAll(e.target.checked, ids);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-800 bg-[var(--dark-bg-base)]/50 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--dark-bg-base)]">
              <tr className="border-b border-gray-800">
                {COLUMNS.map((h, i) => (
                  <th key={i} className={`px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${i === 0 ? 'pl-6 w-10' : ''} ${i === COLUMNS.length - 1 ? 'pr-6 text-right' : ''} ${h === 'Created' ? 'hidden md:table-cell' : ''} ${h === 'Phone' ? 'hidden sm:table-cell' : ''} ${h === 'Date of Birth' ? 'hidden lg:table-cell' : ''}`}>
                    {i === 0 ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(input) => { if (input) input.indeterminate = someSelected && !allSelected; }}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-700 text-[#0058be] focus:ring-[#0058be] bg-[var(--dark-bg-base)] cursor-pointer transition-all"
                        />
                      </div>
                    ) : (
                      h
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-24 first:pl-6 last:pr-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--dark-bg-base)] border border-gray-800 flex items-center justify-center"><Users className="w-6 h-6 text-gray-700" /></div>
                    <div className="text-center"><p className="text-sm font-semibold text-white">No users found</p><p className="text-xs text-gray-600 mt-0.5">Try adjusting your search or filters.</p></div>
                  </div>
                </td></tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <motion.tr key={user.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className={`hover:bg-white/5 group transition-all duration-150 ${selectedIds.includes(user.id) ? 'bg-[#0058be]/[0.02]' : ''}`}>
                    <td className="px-4 py-3.5 pl-6 w-10">
                      <div className="flex items-center justify-center">
                        {user.role !== ROLES.ADMIN && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={(e) => onSelect && onSelect(user.id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-700 text-[#0058be] focus:ring-[#0058be] bg-[var(--dark-bg-base)] cursor-pointer transition-all"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar identifier={user.fullName || user.mail} size="md" />
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate max-w-[160px]">{user.fullName || user.mail}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{user.mail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap hidden sm:table-cell">
                      {user.phone || user.phoneNumber || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap hidden lg:table-cell">
                      {user.dateOfBirth || user.dob ? formatDate(user.dateOfBirth || user.dob) : '-'}
                    </td>
                    <td className="px-4 py-3.5 first:pl-6 last:pr-6">
                      <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold w-[110px] ${ROLE_COLORS[user.role]?.badge || ''}`}>
                        <span className="opacity-70">{RoleIcon[user.role]}</span>{ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 first:pl-6 last:pr-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status] || 'bg-gray-400'}`} />
                        <span className="text-xs text-gray-400 font-medium">{STATUS_LABEL[user.status] || user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap text-xs first:pl-6 last:pr-6" title={formatDate(user.lastLogin)}>{timeAgo(user.lastLogin)}</td>
                    <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap text-xs hidden md:table-cell first:pl-6 last:pr-6">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3.5 first:pl-6 last:pr-6">
                      <div className="flex justify-end">
                        {user.role !== ROLES.ADMIN && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                            title="Edit User"
                            className="p-2 rounded-xl text-gray-400 hover:text-[#0058be] hover:bg-white/5 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0058be]/30">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {users.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} users={users} onPageChange={setCurrentPage} />}
      </div>
    </>
  );
}
