import { Check } from 'lucide-react';

export default function NotificationCard({ notification, onMarkRead, getTypeColor }) {
  return (
    <div className={`p-4 rounded-xl border transition-colors ${notification.isRead ? 'bg-[#161b22] border-white/5' : 'bg-[#161b22] border-[#4A90E2]/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(notification.notificationType)}`}>
          {notification.notificationType?.replace('_', ' ')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>{notification.title}</h3>
          {notification.message && <p className="text-sm text-gray-400 mb-2">{notification.message}</p>}
          <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
        </div>
        {!notification.isRead && (
          <button onClick={() => onMarkRead(notification.id)}
            className="p-2 text-gray-500 hover:text-[#4A90E2] hover:bg-[#4A90E2]/10 rounded-lg transition-colors" title="Mark as read">
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
