import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import { useNotifications } from '@/contexts/NotificationContext';

export function useNotificationsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchUnreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pageIndex = currentPage - 1;
      const size = 10;
      let response;

      if (activeTab === 'unread') {
        response = await notificationService.getUnreadNotifications({ page: pageIndex, size });
      } else {
        response = await notificationService.getNotifications({ page: pageIndex, size });
      }

      const content = response?.content || response || [];
      const formatted = Array.isArray(content)
        ? content.map((item) => ({
            ...item,
            isRead: item.isRead !== undefined ? item.isRead : item.read,
          }))
        : [];

      setNotifications(formatted);
      setTotalPages(response?.totalPages ?? 1);
      setTotalElements(response?.totalElements ?? formatted.length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Could not load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = useCallback(async (id) => {
    try {
      await markAsRead(id);
      // Update local state to mark it read
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
      // Refresh count globally
      fetchUnreadCount();
      // If we are on the unread tab, it's better to reload notifications
      if (activeTab === 'unread') {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [markAsRead, activeTab, fetchNotifications, fetchUnreadCount]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      // Refresh count globally
      fetchUnreadCount();
      // If on unread tab, reset list
      if (activeTab === 'unread') {
        setNotifications([]);
        setTotalElements(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [markAllAsRead, activeTab, fetchUnreadCount]);

  const handleDelete = useCallback(async (id, isRead) => {
    try {
      await deleteNotification(id, isRead);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      fetchUnreadCount();
      // Fetch notifications to fill the gap of pagination if necessary
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [deleteNotification, fetchNotifications, fetchUnreadCount]);

  const handleClearAll = useCallback(async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setTotalElements(0);
      setTotalPages(1);
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
    }
  }, [fetchUnreadCount]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  return {
    activeTab,
    currentPage,
    notifications,
    totalPages,
    totalElements,
    isLoading,
    error,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete,
    handleClearAll,
    handleTabChange,
    setCurrentPage,
  };
}
