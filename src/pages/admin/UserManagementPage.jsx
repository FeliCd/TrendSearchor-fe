import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, Shield, KeyRound, Download, X } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '@/constants/roles';
import { motion, AnimatePresence } from 'framer-motion';
import { userManagementService } from '@/services/userManagementService';
import PageHeader from '@/components/ui/PageHeader';
import UserFilters from '@/components/admin/users/UserFilters';
import UserStatsRow from '@/components/admin/users/UserStatsRow';
import UserCharts from '@/components/admin/users/UserCharts';
import UserTable from '@/components/admin/users/UserTable';
import UserModal from '@/components/admin/users/UserModal';
import DeleteConfirmModal from '@/components/admin/users/DeleteConfirmModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }}
    />
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkRoleModal, setShowBulkRoleModal] = useState(false);
  const [bulkRoleTarget, setBulkRoleTarget] = useState(null);
  const [showBulkResetModal, setShowBulkResetModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExportCSV = () => {
    // Generate CSV from filteredUsers
    if (filteredUsers.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => `${u.id},"${u.fullName || ''}","${u.mail || ''}",${u.role},${u.status}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkResetPassword = async () => {
    try {
      setLoading(true);
      await userManagementService.bulkResetPassword(selectedUserIds);
      setSelectedUserIds([]);
      setShowBulkResetModal(false);
      showToast(`${selectedUserIds.length} passwords reset successfully`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset passwords.');
      showToast('Failed to reset passwords', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = useCallback(async () => {
    try {
      const data = await userManagementService.getUsers({ limit: 1000, size: 1000 });
      setUsers(Array.isArray(data) ? data : data.data ?? []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = () => { setSelectedUser(null); setModalMode('create'); setShowModal(true); };
  const handleEdit = (user) => { setSelectedUser(user); setModalMode('edit'); setShowModal(true); };
  const handleView = (user) => { setSelectedUser(user); setModalMode('view'); setShowModal(true); };
  const handleDelete = (user) => { setDeleteTarget(user); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      await userManagementService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setSelectedUserIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showToast('User deleted successfully');
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to delete user.'); 
      showToast('Failed to delete user', 'error');
    }
    finally { setShowDeleteModal(false); setDeleteTarget(null); }
  };

  const handleSelectUser = (id, checked) => {
    setSelectedUserIds((prev) => checked ? [...prev, id] : prev.filter((uId) => uId !== id));
  };

  const handleSelectAll = (checked, ids) => {
    if (checked) {
      setSelectedUserIds((prev) => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedUserIds.map((id) => userManagementService.deleteUser(id)));
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
      showToast(`${selectedUserIds.length} users deleted successfully`);
      setSelectedUserIds([]);
    } catch (err) {
      setError('Failed to delete some users. They may have already been deleted.');
      showToast('Failed to delete some users', 'error');
    } finally {
      setLoading(false);
      setShowBulkDeleteModal(false);
    }
  };

  const handleBulkRoleChange = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedUserIds.map((id) => userManagementService.updateUserRole(id, bulkRoleTarget)));
      setUsers((prev) => prev.map((u) => selectedUserIds.includes(u.id) ? { ...u, role: bulkRoleTarget } : u));
      showToast(`Roles updated successfully for ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
    } catch (err) {
      setError('Failed to change roles for some users.');
      showToast('Failed to change roles', 'error');
    } finally {
      setLoading(false);
      setShowBulkRoleModal(false);
    }
  };

  const handleSaveUser = async (payload, userId) => {
    try {
      if (modalMode === 'create') {
        const created = await userManagementService.createUser(payload);
        setUsers((prev) => [created, ...prev]);
        showToast('User created successfully');
      } else {
        const updated = await userManagementService.updateUser(userId, payload);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast('User updated successfully');
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
      showToast('Failed to save user', 'error');
      throw err;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.mail?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' 
      ? true 
      : (roleFilter === ROLES.LECTURER 
          ? (u.role === ROLES.LECTURER || u.role === ROLES.STUDENT) 
          : u.role === roleFilter);
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#151515] relative">
      <PageBackground />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="relative z-10">
        <PageHeader title="User Management" description="Manage all users, roles, and account statuses." />
        <div className="w-full px-6 pb-10 mt-6">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-32">
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              
              {/* User Charts */}
              <UserCharts users={filteredUsers} />

              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mb-6">
                <div className="w-full min-w-0 h-full">
                  <UserStatsRow users={filteredUsers} allUsers={users} />
                </div>
                <div className="w-full min-w-0 h-full">
                  <UserFilters search={search} onSearch={setSearch} roleFilter={roleFilter} onRoleFilter={setRoleFilter}
                    statusFilter={statusFilter} onStatusFilter={setStatusFilter} onRefresh={() => { setRefreshing(true); loadUsers(); }}
                    refreshing={refreshing} resultCount={filteredUsers.length} totalCount={users.length}
                    action={
                      <div className="flex flex-wrap items-center gap-2 w-full">
                        {/* Change Role Button */}
                        <div className="relative group flex-1">
                          <button
                            disabled={selectedUserIds.length === 0}
                            className="w-full flex items-center justify-center gap-1.5 h-11 px-4 border-2 text-[11px] font-black uppercase tracking-widest bg-[#1e1e1e] text-white border-gray-800 hover:border-gray-700 transition-all shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Shield className="w-4 h-4 text-[#0058be] opacity-70 group-disabled:opacity-50" />
                            <span className="whitespace-nowrap">Role</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          </button>

                          {/* Dropdown Menu */}
                          {selectedUserIds.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-56 border-2 border-gray-800 shadow-none overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-[#1e1e1e]">
                              <div className="max-h-48 overflow-y-auto py-1">
                                {Object.values(ROLES)
                                  .filter(r => r !== ROLES.ADMIN && r !== ROLES.STUDENT)
                                  .map(r => (
                                  <button key={r} onClick={() => { setBulkRoleTarget(r); setShowBulkRoleModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors">
                                    <Shield className="w-3.5 h-3.5 text-[#0058be]" />
                                    <span className="whitespace-nowrap">{r === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[r]}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => setShowBulkDeleteModal(true)}
                          disabled={selectedUserIds.length === 0}
                          className="w-full flex-1 flex items-center justify-center gap-1.5 h-11 px-4 border-2 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#1e1e1e] border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="whitespace-nowrap">Delete</span>
                        </button>

                        <div className="h-5 w-px bg-gray-800 hidden sm:block mx-0.5" />

                        {/* Reset Password Button */}
                        <button
                          onClick={() => setShowBulkResetModal(true)}
                          disabled={selectedUserIds.length === 0}
                          className="w-full flex-1 flex items-center justify-center gap-1.5 h-11 px-4 border-2 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#1e1e1e] border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span className="whitespace-nowrap">Reset</span>
                        </button>

                        <div className="h-5 w-px bg-gray-800 hidden sm:block mx-0.5" />

                        {/* Add User Button */}
                        <button onClick={handleCreate} className="w-full flex-1 flex items-center justify-center gap-1.5 h-11 px-4 border-2 border-transparent text-[11px] font-black uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all shadow-none">
                          <Plus className="w-4 h-4" />
                          <span className="whitespace-nowrap">Add User</span>
                        </button>

                        <div className="h-5 w-px bg-gray-800 hidden sm:block mx-0.5" />

                        {/* Export CSV Button */}
                        <button
                          onClick={handleExportCSV}
                          disabled={filteredUsers.length === 0}
                          className="w-full flex-1 flex items-center justify-center gap-1.5 h-11 px-4 border-2 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#1e1e1e] border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Download className="w-4 h-4" />
                          <span className="whitespace-nowrap">Export</span>
                        </button>
                      </div>
                    } />
                </div>
              </div>
              <UserTable users={filteredUsers} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} selectedIds={selectedUserIds} onSelect={handleSelectUser} onSelectAll={handleSelectAll} />
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showModal && <UserModal user={selectedUser} mode={modalMode} onClose={() => setShowModal(false)} onSave={handleSaveUser} />}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <DeleteConfirmModal user={deleteTarget} onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }} onConfirm={confirmDelete} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBulkDeleteModal && (
          <DeleteConfirmModal user={{ fullName: `${selectedUserIds.length} selected users`, mail: 'This will delete all selected accounts.' }} onClose={() => setShowBulkDeleteModal(false)} onConfirm={handleBulkDelete} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBulkRoleModal && bulkRoleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBulkRoleModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm p-6 border-2 border-gray-800 bg-[#151515]">
              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
                  <Shield className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="text-lg font-bold text-white">Change Role</h3>
              </div>
              <button onClick={() => setShowBulkRoleModal(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to change the role of <span className="font-bold text-white">{selectedUserIds.length} selected users</span> to <span className="font-bold text-[#0058be]">{bulkRoleTarget === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[bulkRoleTarget]}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowBulkRoleModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleBulkRoleChange} className="flex-1 px-4 py-3 border-2 border-[#0058be] bg-[#0058be] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#004395] transition-all">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBulkResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBulkResetModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm p-6 border-2 border-gray-800 bg-[#151515]">
              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-10 h-10 border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
                  <KeyRound className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Reset Passwords</h3>
              </div>
              <button onClick={() => setShowBulkResetModal(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to reset passwords for <span className="font-bold text-white">{selectedUserIds.length} selected users</span>? A default password or reset link will be sent to their emails.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowBulkResetModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleBulkResetPassword} className="flex-1 px-4 py-3 border-2 border-orange-500 bg-orange-500 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
