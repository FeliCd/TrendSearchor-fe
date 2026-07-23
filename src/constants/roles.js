export const ROLES = {


















































































































































































































































































































































  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
  RESEARCHER: 'RESEARCHER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.LECTURER]: 'Lecturer / Student',
  [ROLES.STUDENT]: 'Student',
  [ROLES.RESEARCHER]: 'Researcher',
};

export const ROLE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400 border-2 border-red-500/30',
  },
  [ROLES.LECTURER]: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30',
  },
  [ROLES.STUDENT]: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30',
  },
  [ROLES.RESEARCHER]: {
    bg: 'bg-[#0058be]/10',
    text: 'text-[#0058be]',
    border: 'border-[#0058be]/30',
    badge: 'bg-[#0058be]/10 text-[#0058be] border-2 border-[#0058be]/30',
  },
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30',
  [USER_STATUS.INACTIVE]: 'bg-yellow-500/10 text-yellow-400 border-2 border-yellow-500/30',
};
