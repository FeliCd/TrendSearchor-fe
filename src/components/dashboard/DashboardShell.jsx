import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { Menu } from 'lucide-react';

export default function DashboardShell({ sidebarConfig }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#010409]">
      <div className="fixed inset-y-0 left-0 z-40 flex-shrink-0">
        <div className="flex h-full">
          <DashboardSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((p) => !p)}
            config={sidebarConfig}
          />
        </div>
      </div>

      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#161b22] border border-white/10 text-white lg:hidden"
        onClick={() => setCollapsed((p) => !p)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? 'ml-[68px]' : 'ml-[240px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
