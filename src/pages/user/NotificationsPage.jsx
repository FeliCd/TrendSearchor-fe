import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import NotificationCard from '@/components/notifications/NotificationCard';

const TYPE_COLORS = {
  NEW_PAPER: 'bg-[#4A90E2]/10 text-[#4A90E2]',
  TRENDING: 'bg-purple-500/10 text-purple-400',
  JOURNAL_UPDATE: 'bg-green-500/10 text-green-400',
};
const getTypeColor = (type) => TYPE_COLORS[type] || 'bg-gray-500/10 text-gray-400';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  const loadNotifications = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = filter === 'unread'
        ? await notificationService.getUnreadNotifications({ page, size: 10 })
        : await notificationService.getNotifications({ page, size: 10 });
      setNotifications(data.content || []);
    } catch (err) { setError('Failed to load notifications.'); }
    finally { setLoading(false); }
  }, [page, filter]);

  const loadUnreadCount = useCallback(async () => {
    try { const data = await notificationService.getUnreadCount(); setUnreadCount(data.count || 0); }
    catch { /* silent */ }
  }, []);

  useEffect(() => { loadNotifications(); loadUnreadCount(); }, [loadNotifications, loadUnreadCount]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) { setError('Failed to mark as read.'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { setError('Failed to mark all as read.'); }
  };

  return (
    <div className="min-h-screen bg-[#010409] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#4A90E2]" />
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && <p className="text-sm text-gray-400">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors">
              <CheckCheck className="w-4 h-4" />Mark all read
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-6">
          {[{ v: 'all', l: 'All' }, { v: 'unread', l: 'Unread' }].map(({ v, l }) => (
            <button key={v} onClick={() => { setFilter(v); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === v ? 'bg-[#4A90E2] text-white' : 'bg-[#161b22] text-gray-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
        {error && <Alert type="error" message={error} />}
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} getTypeColor={getTypeColor} />)}
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30">Previous</button>
              <span className="px-4 py-2 text-gray-400">Page {page + 1}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={notifications.length < 10}
                className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
