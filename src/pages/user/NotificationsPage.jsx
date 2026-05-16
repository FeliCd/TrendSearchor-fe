import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = filter === 'unread'
        ? await notificationService.getUnreadNotifications({ page, size: 10 })
        : await notificationService.getNotifications({ page, size: 10 });
      setNotifications(data.content || []);
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      setError('Failed to mark as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all as read.');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'NEW_PAPER': return 'bg-[#4A90E2]/10 text-[#4A90E2]';
      case 'TRENDING': return 'bg-purple-500/10 text-purple-400';
      case 'JOURNAL_UPDATE': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#4A90E2]" />
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-400">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#4A90E2] text-white'
                  : 'bg-[#161b22] text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : 'Unread'}
            </button>
          ))}
        </div>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-colors ${
                  notification.isRead
                    ? 'bg-[#161b22] border-white/5'
                    : 'bg-[#161b22] border-[#4A90E2]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(notification.notificationType)}`}>
                    {notification.notificationType?.replace('_', ' ')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium mb-1 ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    {notification.message && (
                      <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="p-2 text-gray-500 hover:text-[#4A90E2] hover:bg-[#4A90E2]/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-400">Page {page + 1}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={notifications.length < 10}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
