import { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2, Eye, Users } from 'lucide-react';
import { ROLE_LABELS, ROLE_COLORS, STATUS_COLORS } from '@/constants/roles';
import { formatDate, timeAgo } from '@/utils/dateUtils';

const ITEMS_PER_PAGE = 10;

const COLUMNS = ['User', 'Role', 'Status', 'Last Login', 'Created', ''];

export default function UserTable({ users, onEdit, onView, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="bg-[#0d1117]/60 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#8b949e] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-[#8b949e]">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-[#8b949e]/40" />
                      <p className="font-medium">No users found</p>
                      <p className="text-xs text-[#8b949e]/60">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {(user.username?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{user.username}</p>
                          <p className="text-xs text-[#8b949e] truncate">{user.mail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${ROLE_COLORS[user.role]?.badge || ''}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${STATUS_COLORS[user.status] || ''}`}>
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[#8b949e] whitespace-nowrap" title={formatDate(user.lastLogin)}>
                      {timeAgo(user.lastLogin)}
                    </td>

                    <td className="px-4 py-3.5 text-[#8b949e] whitespace-nowrap hidden md:table-cell">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openMenuId === user.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 mt-1 w-36 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl py-1 z-20">
                              <button onClick={() => { onView(user); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#e6edf3] hover:bg-white/5 transition-colors">
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </button>
                              <button onClick={() => { onEdit(user); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#e6edf3] hover:bg-white/5 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit User
                              </button>
                              <button onClick={() => { onDelete(user); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/5 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <p className="text-xs text-[#8b949e]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8b949e] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === currentPage
                      ? 'bg-[#4A90E2] text-white'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8b949e] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
