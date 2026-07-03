import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data?.count ?? 0);
    } catch (err) {
      console.error('Failed to fetch unread notification count:', err);
    }
  }, [isAuthenticated]);

  // Fetch count on login and poll periodically
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60_000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Optimistically decrement, or refetch
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (id, isRead) => {
    try {
      await notificationService.deleteNotification(id);
      if (!isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.warn('Backend delete notification API failed, applying client-side fallback only.', err);
      // Suppress error propagation so UI state update is not interrupted
      if (!isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      unreadCount,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [unreadCount, fetchUnreadCount, markAsRead, markAllAsRead, deleteNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
