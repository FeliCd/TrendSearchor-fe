export function getNormalizedNotificationType(notification) {
  if (!notification) return 'SYSTEM';
  const type = notification.notificationType || 'SYSTEM';
  const title = (notification.title || '').toLowerCase();
  const message = (notification.message || '').toLowerCase();

  if (title.includes('revoke') || message.includes('revoke')) {
    return 'PAPER_REVOKED';
  }

  if (type === 'APPROVAL') {
    if (title.includes('reject') || message.includes('reject')) {
      return 'PAPER_REJECTED';
    }
    return 'PAPER_APPROVED';
  }

  return type;
}

export function getNotificationTypeColor(type) {
  switch (type) {
    case 'SYSTEM':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'RECOMMENDATION':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'NEW_PAPER':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'APPROVAL':
    case 'PAPER_APPROVED':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'ALERT':
    case 'PAPER_REJECTED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    case 'PAPER_REVOKED':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
}

export function getNotificationTypeLabel(type) {
  if (!type) return 'SYSTEM';
  return type.replace(/_/g, ' ');
}
