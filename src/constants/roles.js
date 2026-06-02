export const ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
  RESEARCHER: 'RESEARCHER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.LECTURER]: 'Lecturer',
  [ROLES.STUDENT]: 'Student',
  [ROLES.RESEARCHER]: 'Researcher',
};

export const ROLE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  [ROLES.LECTURER]: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  [ROLES.STUDENT]: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
  [ROLES.RESEARCHER]: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  },
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  [USER_STATUS.INACTIVE]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
};
