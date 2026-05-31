const AVATAR_COLORS = [
  'bg-blue-600/30 border-blue-500/30 text-blue-300',
  'bg-emerald-600/30 border-emerald-500/30 text-emerald-300',
  'bg-purple-600/30 border-purple-500/30 text-purple-300',
  'bg-red-600/30 border-red-500/30 text-red-300',
  'bg-yellow-600/30 border-yellow-500/30 text-yellow-300',
  'bg-cyan-600/30 border-cyan-500/30 text-cyan-300',
  'bg-pink-600/30 border-pink-500/30 text-pink-300',
];

/**
 * Returns a stable color class based on username hash.
 */
export function getAvatarColor(username, fallback = 'bg-gray-600') {
  if (!username) return fallback;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Returns initials from a username.
 */
export function getInitials(username) {
  if (!username) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

/**
 * Shared avatar component.
 * @param {string} username
 * @param {string} size - sm | md | lg | xl (default: md)
 * @param {string} className
 */
export default function UserAvatar({ username, size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base',
  };
  const sz = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold border flex-shrink-0
        transition-transform duration-200 group-hover:scale-105
        ${getAvatarColor(username)} ${sz} ${className}`}
    >
      {getInitials(username)}
    </div>
  );
}
