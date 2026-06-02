import { ROLES, ROLE_LABELS } from '@/constants/roles';

export { ROLES, ROLE_LABELS };

export const ROLE_DASHBOARD = {
  [ROLES.ADMIN]:      '/admin',
  [ROLES.LECTURER]:   '/academic',
  [ROLES.STUDENT]:    '/academic',
  [ROLES.RESEARCHER]: '/researcher',
};

export function getDashboardPath(role) {
  if (!role) return '/login';
  return ROLE_DASHBOARD[role] || '/login';
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}
