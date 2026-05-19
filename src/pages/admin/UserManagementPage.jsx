import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userManagementService } from '@/services/userManagementService';
import PageHeader from '@/components/ui/PageHeader';
import UserFilters from '@/components/admin/users/UserFilters';
import UserStatsRow from '@/components/admin/users/UserStatsRow';
import UserTable from '@/components/admin/users/UserTable';
import UserModal from '@/components/admin/users/UserModal';
import DeleteConfirmModal from '@/components/admin/users/DeleteConfirmModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function PageBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[400px] rounded-full bg-purple-600/[0.02] blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
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

  const loadUsers = useCallback(async () => {
    try {
      const data = await userManagementService.getUsers();
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
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete user.'); }
    finally { setShowDeleteModal(false); setDeleteTarget(null); }
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
    const matchSearch = !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.mail?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#010409] relative overflow-hidden">
      <PageBackground />
      <div className="relative z-10">
        <PageHeader title="User Management" description="Manage all users, roles, and account statuses."
          action={<Plus className="w-4 h-4" />} actionLabel="Add User" onAction={handleCreate} />
        <div className="w-full px-6 pb-10">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
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
              <UserFilters search={search} onSearch={setSearch} roleFilter={roleFilter} onRoleFilter={setRoleFilter}
                statusFilter={statusFilter} onStatusFilter={setStatusFilter} onRefresh={() => { setRefreshing(true); loadUsers(); }}
                refreshing={refreshing} resultCount={filteredUsers.length} totalCount={users.length} />
              <UserStatsRow users={filteredUsers} allUsers={users} />
              <UserTable users={filteredUsers} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
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
    </div>
  );
}
