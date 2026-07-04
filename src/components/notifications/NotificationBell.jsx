import { useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationDropdown } from '@/hooks/useNotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/roleUtils';

const TYPE_COLOR_MAP = {
  SYSTEM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  RECOMMENDATION: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  NEW_PAPER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  APPROVAL: 'bg-green-500/10 text-green-400 border border-green-500/20',
  ALERT: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

function getTypeColor(type) {
  return TYPE_COLOR_MAP[type] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
}

export default function NotificationBell() {
  const { user } = useAuth();
  const {
    isOpen,
    notifications,
    isLoading,
    unreadCount,
    toggle,
    close,
    handleMarkRead,
    handleMarkAllRead,
  } = useNotificationDropdown();

  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  const getNotificationsPath = (role) => {
    if (!role) return '/login';
    if (role === 'ADMIN') return '/admin/notifications';
    if (role === 'RESEARCHER') return '/researcher/notifications';
    if (role === 'LECTURER' || role === 'STUDENT') return '/academic/notifications';
    return '/dashboard';
  };
  const notificationsPath = user ? getNotificationsPath(user.role) : '/login';

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        id="btn-notification-bell"
        onClick={toggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            id="notification-badge"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black bg-red-600 text-white rounded-full px-1 leading-none animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-[380px] bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 z-50 flex flex-col overflow-hidden"
          style={{ maxHeight: '480px' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0058be]" />
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasUnread && (
                <button
                  id="btn-bell-mark-all-read"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={close}
                className="p-1 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin" data-lenis-prevent="true">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Bell className="w-8 h-8 text-gray-700 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  No notifications
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-800/60">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                      notification.isRead ? 'opacity-60' : 'bg-[#0058be]/5 hover:bg-[#0058be]/10'
                    }`}
                  >
                    {/* Unread dot */}
                    {!notification.isRead && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#0058be] flex-shrink-0" />
                    )}
                    {notification.isRead && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-transparent flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${getTypeColor(notification.notificationType)}`}
                        >
                          {notification.notificationType?.replace('_', ' ')}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-medium leading-snug truncate ${
                          notification.isRead ? 'text-gray-400' : 'text-white'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-600 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <button
                        id={`btn-bell-mark-read-${notification.id}`}
                        onClick={() => handleMarkRead(notification.id)}
                        title="Mark as read"
                        className="p-1.5 text-gray-600 hover:text-[#0058be] hover:bg-[#0058be]/10 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Panel footer */}
          <div className="shrink-0 px-4 py-2.5 border-t border-gray-800 bg-[#151515]">
            <Link
              to={notificationsPath}
              onClick={close}
              className="block text-center text-[10px] font-black uppercase tracking-widest text-[#0058be] hover:text-white transition-colors py-1"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
