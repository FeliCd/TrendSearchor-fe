import { ROLES } from '@/constants/roles';

export const ROLE_DASHBOARD = {
  [ROLES.ADMIN]:      '/admin',
  [ROLES.LECTURER]:   '/lecturer',
  [ROLES.STUDENT]:    '/student',
  [ROLES.RESEARCHER]: '/researcher',
  [ROLES.USER]:       '/user',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]:      'Admin',
  [ROLES.LECTURER]:   'Lecturer',
  [ROLES.STUDENT]:    'Student',
  [ROLES.RESEARCHER]: 'Researcher',
  [ROLES.USER]:       'User',
};

export function getDashboardPath(role) {
  if (!role) return '/login';
  return ROLE_DASHBOARD[role] || '/login';
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}
