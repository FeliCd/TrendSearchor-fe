import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { Menu } from 'lucide-react';

export default function DashboardShell({ sidebarConfig }) {

  return (
    <div className="flex bg-[var(--dark-bg-base)]">
      <div className="fixed inset-y-0 left-0 z-40 flex-shrink-0">
        <div className="flex h-full">
          <DashboardSidebar config={sidebarConfig} />
        </div>
      </div>

      <main
        id="dashboard-main"
        className="flex-1 min-w-0 transition-all duration-300 scroll-smooth ml-[240px]"
      >
        <Outlet />
      </main>
    </div>
  );
}
