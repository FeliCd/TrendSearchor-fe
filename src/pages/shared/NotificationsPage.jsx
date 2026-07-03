import React from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import NotificationCard from '@/components/notifications/NotificationCard';
import { useNotificationsPage } from '@/hooks/useNotificationsPage';

function PageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{
        backgroundImage:
          'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
  );
}

function EmptyState({ activeTab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-14 h-14 border-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-center mb-4">
        <Bell className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">
        {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
      </p>
      <p className="text-xs text-gray-600 max-w-[280px] leading-relaxed">
        {activeTab === 'unread'
          ? 'You are all caught up! There are no new alerts.'
          : 'You will see system updates and research alerts here.'}
      </p>
    </div>
  );
}

const getTypeColor = (type) => {
  switch (type) {
    case 'SYSTEM':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'RECOMMENDATION':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'NEW_PAPER':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'APPROVAL':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'ALERT':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

export default function NotificationsPage() {
  const {
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
  } = useNotificationsPage();

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="bg-[#151515] flex flex-col h-screen overflow-hidden relative">
      <PageBackground />

      {/* Header */}
      <div className="relative z-20 shrink-0">
        <PageHeader
          title="Notifications"
          description="Stay updated with system activities, trends, and paper moderations."
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col px-6 pb-6 pt-4">
        <div className="flex-1 min-h-0 flex flex-col border-2 border-gray-800 bg-[#151515] shadow-2xl">
          
          {/* Controls Bar */}
          <div className="h-14 px-4 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 border-2 border-gray-700 h-10">
              <button
                id="tab-all-notifications"
                onClick={() => handleTabChange('all')}
                className={`px-4 h-full text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#0058be] text-white'
                    : 'text-gray-500 hover:text-white hover:bg-[#252525]'
                }`}
              >
                All
              </button>
              <button
                id="tab-unread-notifications"
                onClick={() => handleTabChange('unread')}
                className={`px-4 h-full text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'unread'
                    ? 'bg-[#0058be] text-white'
                    : 'text-gray-500 hover:text-white hover:bg-[#252525]'
                }`}
              >
                Unread
              </button>
            </div>

            <div className="flex items-center gap-2">
              {hasUnread && (
                <button
                  id="btn-mark-all-read"
                  onClick={handleMarkAllRead}
                  className="h-10 flex items-center gap-2 px-4 bg-[#1e1e1e] hover:bg-[#0058be]/10 text-white text-[11px] font-black uppercase tracking-widest transition-colors border-2 border-gray-700 hover:border-[#0058be]/50"
                >
                  <CheckCheck className="w-4 h-4 text-[#0058be]" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  id="btn-clear-all"
                  onClick={handleClearAll}
                  className="h-10 flex items-center gap-2 px-4 bg-[#1e1e1e] hover:bg-red-500/10 text-red-500 hover:text-red-400 text-[11px] font-black uppercase tracking-widest transition-colors border-2 border-gray-700 hover:border-red-500/50"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-thin p-6" data-lenis-prevent="true">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2">Error</p>
                <p className="text-xs text-gray-500">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState activeTab={activeTab} />
            ) : (
              <div className="grid grid-cols-1 gap-4 w-full">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    getTypeColor={getTypeColor}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {!isLoading && !error && notifications.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalElements}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
            />
          )}

        </div>
      </div>
    </div>
  );
}
