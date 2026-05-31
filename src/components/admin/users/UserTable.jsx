import { useState, useEffect, useRef, useCallback } from 'react';
import { MoreHorizontal, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';
import { formatDate, timeAgo } from '@/utils/dateUtils';
import UserAvatar from '@/components/ui/UserAvatar';
import RoleIcon from '@/components/ui/RoleIcon';
import ActionMenu from './ActionMenu';

const ITEMS_PER_PAGE = 10;
const COLUMNS = ['User', 'Role', 'Status', 'Last Login', 'Created', ''];
const STATUS_DOT = { ACTIVE: 'bg-emerald-400', INACTIVE: 'bg-yellow-400', SUSPENDED: 'bg-red-400' };
const STATUS_LABEL = { ACTIVE: 'Active', INACTIVE: 'Inactive', SUSPENDED: 'Suspended' };

function Pagination({ currentPage, totalPages, users, onPageChange }) {
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1 || page === 2 || page === totalPages - 1
  );
  return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-white/[0.06]">
        <p className="text-xs text-[#8b949e]">
          Showing <span className="text-[#c9d1d9] font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, users.length)}</span> of <span className="text-[#c9d1d9] font-semibold">{users.length}</span> users
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">Prev</button>
          {pageNums.map((page, idx) => {
            const prev = pageNums[idx - 1];
            return (
                <span key={page} className="flex items-center">
              {prev && page - prev > 1 && <span className="px-1.5 text-xs text-[#484f58]">...</span>}
                  <button onClick={() => onPageChange(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${page === currentPage ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25' : 'text-[#8b949e] hover:text-white hover:bg-white/5 border-transparent'}`}>
                {page}
              </button>
            </span>
            );
          })}
          <button onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">Next</button>
        </div>
      </div>
  );
}

export default function UserTable({ users, onEdit, onView, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const btnRefs = useRef({});

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [users.length]);

  // Đóng menu khi scroll
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleOpenMenu = useCallback((e, userId) => {
    e.stopPropagation();
    if (openMenuId === userId) { setOpenMenuId(null); return; }
    const btn = btnRefs.current[userId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const menuWidth = 176; // w-44 = 11rem = 176px
      setMenuPosition({
        top: rect.bottom + 4,
        // căn phải theo button, không tràn màn hình
        left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      });
    }
    setOpenMenuId(userId);
  }, [openMenuId]);

  return (
      <>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117]/50 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-[#0d1117]">
              <tr className="border-b border-white/[0.06]">
                {COLUMNS.map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#8b949e] whitespace-nowrap first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
              {paginatedUsers.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-24 first:pl-6 last:pr-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-white/[0.06] flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#8b949e]/40" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-[#c9d1d9]">No users found</p>
                        <p className="text-xs text-[#8b949e]/60 mt-0.5">Try adjusting your search or filters.</p>
                      </div>
                    </div>
                  </td></tr>
              ) : (
                  paginatedUsers.map((user, idx) => (
                      <motion.tr key={user.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                 transition={{ duration: 0.2, delay: idx * 0.03 }}
                                 className="hover:bg-white/[0.02] group transition-all duration-150">
                        <td className="px-4 py-3.5 first:pl-6">
                          <div className="flex items-center gap-3">
                            <UserAvatar username={user.username} size="md" />
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-sm truncate max-w-[160px]">{user.username}</p>
                              <p className="text-xs text-[#8b949e] truncate max-w-[200px] mt-0.5">{user.mail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${ROLE_COLORS[user.role]?.badge || ''}`}>
                        <span className="opacity-70">{RoleIcon[user.role]}</span>{ROLE_LABELS[user.role] || user.role}
                      </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status] || 'bg-gray-400'}`} />
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${ROLE_COLORS[user.status] || ''}`}>
                          {STATUS_LABEL[user.status] || user.status}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[#8b949e] whitespace-nowrap text-xs" title={formatDate(user.lastLogin)}>
                          {timeAgo(user.lastLogin)}
                        </td>
                        <td className="px-4 py-3.5 text-[#8b949e] whitespace-nowrap text-xs hidden md:table-cell">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* ── Action cell ── */}
                        <td className="px-4 py-3.5 last:pr-6">
                          <div className="flex justify-end">
                            <button
                                ref={(el) => { btnRefs.current[user.id] = el; }}
                                onClick={(e) => handleOpenMenu(e, user.id)}
                                className="p-2 rounded-xl text-[#8b949e] hover:text-white hover:bg-white/5 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
          {users.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} users={users} onPageChange={setCurrentPage} />
          )}
        </div>

        {/* Portal ra ngoài mọi overflow, dùng fixed */}
        <AnimatePresence>
          {openMenuId !== null && (() => {
            const user = users.find((u) => u.id === openMenuId);
            return user ? (
                <ActionMenu
                    key={openMenuId}
                    user={user}
                    onEdit={onEdit}
                    onView={onView}
                    onDelete={onDelete}
                    onClose={() => setOpenMenuId(null)}
                    position={menuPosition}
                />
            ) : null;
          })()}
        </AnimatePresence>
      </>
  );
}