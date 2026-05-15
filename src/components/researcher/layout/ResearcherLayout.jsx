import { Outlet } from 'react-router-dom';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { ROLE_SIDEBAR_CONFIG } from '@/constants/sidebarConfig';

export default function ResearcherLayout() {
  return (
    <DashboardShell sidebarConfig={ROLE_SIDEBAR_CONFIG.RESEARCHER}>
      <Outlet />
    </DashboardShell>
  );
}
