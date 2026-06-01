import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Settings, ChevronDown, Shield, KeyRound, Download } from 'lucide-react';
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

function PageBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0058be]/[0.03] blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#009668]/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[400px] rounded-full bg-[#0b1c30]/[0.02] blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />
    </>
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
      // Simulate API call for bulk reset
      await Promise.all(selectedUserIds.map((id) => new Promise(resolve => setTimeout(resolve, 300))));
      // Clear selection
      setSelectedUserIds([]);
      setShowBulkResetModal(false);
    } catch (err) {
      setError('Failed to reset passwords.');
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
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete user.'); }
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
      setSelectedUserIds([]);
    } catch (err) {
      setError('Failed to delete some users. They may have already been deleted.');
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
      setSelectedUserIds([]);
    } catch (err) {
      setError('Failed to change roles for some users.');
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
      } else {
        const updated = await userManagementService.updateUser(userId, payload);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
      throw err;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.mail?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-transparent relative">
      <PageBackground />
      <div className="relative z-10">
        <PageHeader title="User Management" description="Manage all users, roles, and account statuses." />
        <div className="w-full px-6 pb-10 mt-6">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
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
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white text-[#0b1c30] border border-[#c6c6cd]/60 hover:bg-[#f8f9ff] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Shield className="w-4 h-4 text-[#0b1c30] opacity-70 group-disabled:opacity-50" />
                            <span className="whitespace-nowrap">Role</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#76777d]" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {selectedUserIds.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-[#c6c6cd]/60 rounded-xl shadow-xl shadow-black/5 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              <div className="max-h-48 overflow-y-auto py-1">
                                {Object.values(ROLES)
                                  .filter(r => r !== ROLES.ADMIN && r !== ROLES.STUDENT)
                                  .map(r => (
                                  <button key={r} onClick={() => { setBulkRoleTarget(r); setShowBulkRoleModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-[#0b1c30] hover:bg-[#f8f9ff] transition-colors">
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
                          className="w-full flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:text-red-400 disabled:border-red-100 disabled:hover:bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="whitespace-nowrap">Delete</span>
                        </button>

                        <div className="h-5 w-px bg-[#c6c6cd]/60 hidden sm:block mx-0.5" />

                        {/* Reset Password Button */}
                        <button
                          onClick={() => setShowBulkResetModal(true)}
                          disabled={selectedUserIds.length === 0}
                          className="w-full flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:text-orange-400 disabled:border-orange-100 disabled:hover:bg-white"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span className="whitespace-nowrap">Reset</span>
                        </button>

                        <div className="h-5 w-px bg-[#c6c6cd]/60 hidden sm:block mx-0.5" />

                        {/* Add User Button */}
                        <button onClick={handleCreate} className="w-full flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-[#0058be] hover:bg-[#004395] text-white transition-all shadow-sm border border-[#0058be]">
                          <Plus className="w-4 h-4" />
                          <span className="whitespace-nowrap">Add User</span>
                        </button>

                        <div className="h-5 w-px bg-[#c6c6cd]/60 hidden sm:block mx-0.5" />

                        {/* Export CSV Button */}
                        <button
                          onClick={handleExportCSV}
                          disabled={filteredUsers.length === 0}
                          className="w-full flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:text-emerald-400 disabled:border-emerald-100 disabled:hover:bg-white"
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-[#c6c6cd]/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#f8f9ff] border border-[#0058be]/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Change Role</h3>
              </div>
              <p className="text-sm text-[#76777d] mb-6 leading-relaxed">
                Are you sure you want to change the role of <span className="font-bold text-[#0b1c30]">{selectedUserIds.length} selected users</span> to <span className="font-bold text-[#0058be]">{bulkRoleTarget === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[bulkRoleTarget]}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowBulkRoleModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#76777d] hover:bg-[#f8f9ff] hover:text-[#0b1c30] border border-[#c6c6cd]/60 transition-all">Cancel</button>
                <button onClick={handleBulkRoleChange} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0058be] hover:bg-[#004395] shadow-sm transition-all">Confirm Change</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBulkResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBulkResetModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-[#c6c6cd]/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Reset Passwords</h3>
              </div>
              <p className="text-sm text-[#76777d] mb-6 leading-relaxed">
                Are you sure you want to reset passwords for <span className="font-bold text-[#0b1c30]">{selectedUserIds.length} selected users</span>? A default password or reset link will be sent to their emails.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowBulkResetModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#76777d] hover:bg-[#f8f9ff] hover:text-[#0b1c30] border border-[#c6c6cd]/60 transition-all">Cancel</button>
                <button onClick={handleBulkResetPassword} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-all">Confirm Reset</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
