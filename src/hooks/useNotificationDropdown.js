import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { useNotifications } from '@/contexts/NotificationContext';

const PREVIEW_SIZE = 8;

export function useNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { unreadCount, markAsRead, markAllAsRead, fetchUnreadCount } = useNotifications();

  const fetchPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications({ page: 0, size: PREVIEW_SIZE });
      const content = response?.content || response || [];
      const formatted = Array.isArray(content)
        ? content.map((item) => ({
            ...item,
            isRead: item.isRead !== undefined ? item.isRead : item.read,
          }))
        : [];
      setNotifications(formatted);
    } catch (err) {
      console.error('Failed to fetch notification preview:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    fetchPreview();
  }, [fetchPreview]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const handleMarkRead = useCallback(
    async (id) => {
      try {
        await markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        fetchUnreadCount();
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    },
    [markAsRead, fetchUnreadCount]
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [markAllAsRead, fetchUnreadCount]);

  return {
    isOpen,
    notifications,
    isLoading,
    unreadCount,
    toggle,
    close,
    handleMarkRead,
    handleMarkAllRead,
  };
}
