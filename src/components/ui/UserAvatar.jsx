import React from 'react';

/**
 * Returns initials from a full name or email.
 */
export function getInitials(identifier) {
  if (!identifier) return '?';
  const parts = identifier.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const emailPrefix = identifier.includes('@') ? identifier.split('@')[0] : identifier;
  return emailPrefix.slice(0, 2).toUpperCase();
}

/**
 * Shared avatar component that supports image URLs and falls back to initials.
 * Supports both new API (user, profile) and legacy API (identifier).
 */
export default function UserAvatar({ user, profile, identifier, size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-4xl',
    full: 'w-full h-full text-4xl',
  };
  const sz = sizeClasses[size] || sizeClasses.md;

  const avatarUrl = profile?.avatarUrl || user?.avatarUrl;

  if (avatarUrl) {
    return (
      <div className={`rounded-full overflow-hidden flex-shrink-0 ${sz} ${className}`}>
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }

  const name = identifier || profile?.fullName || user?.fullName || user?.mail || '?';
  const firstLetter = name[0].toUpperCase();

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-[#f8f9ff] text-[#0058be] ${sz} ${className}`}
    >
      {firstLetter}
    </div>
  );
}
