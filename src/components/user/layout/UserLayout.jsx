import { Outlet } from 'react-router-dom';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { ROLE_SIDEBAR_CONFIG } from '@/constants/sidebarConfig';

export default function UserLayout() {
  return (
    <DashboardShell sidebarConfig={ROLE_SIDEBAR_CONFIG.USER}>
      <Outlet />
    </DashboardShell>
  );
}
