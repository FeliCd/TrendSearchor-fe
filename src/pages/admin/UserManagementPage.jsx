import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { userManagementService } from '@/services/userManagementService';
import PageHeader from '@/components/ui/PageHeader';
import UserFilters from '@/components/admin/users/UserFilters';
import UserStatsRow from '@/components/admin/users/UserStatsRow';
import UserTable from '@/components/admin/users/UserTable';
import UserModal from '@/components/admin/users/UserModal';
import DeleteConfirmModal from '@/components/admin/users/DeleteConfirmModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setDeleteTarget(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await userManagementService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
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
    const matchSearch =
      !search ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.mail?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#010409]">
      <PageHeader
        title="User Management"
        description="Manage all users, roles, and account statuses."
        action={<Plus className="w-4 h-4" />}
        actionLabel="Add User"
        onAction={handleCreate}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <UserFilters
              search={search}
              onSearch={(val) => setSearch(val)}
              roleFilter={roleFilter}
              onRoleFilter={(val) => setRoleFilter(val)}
              statusFilter={statusFilter}
              onStatusFilter={(val) => setStatusFilter(val)}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
            <UserStatsRow users={filteredUsers} />
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {showDeleteModal && deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
