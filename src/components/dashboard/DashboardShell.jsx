import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import SearchChatbot from '@/components/chatbot/SearchChatbot';

export default function DashboardShell({ sidebarConfig, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-[#151515] min-h-screen text-white relative overflow-x-hidden">
      {/* Sidebar (Always visible: Mini icons on small screens, expanded on desktop) */}
      <div className="fixed inset-y-0 left-0 z-40 flex-shrink-0">
        <div className="flex h-full">
          <DashboardSidebar 
            config={sidebarConfig} 
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main
        id="dashboard-main"
        className={`flex-1 min-w-0 transition-all duration-300 scroll-smooth ${
          collapsed 
            ? 'ml-16 sm:ml-20' 
            : 'ml-16 sm:ml-20 lg:ml-[240px]'
        }`}
      >
        {children || <Outlet />}
      </main>

      {sidebarConfig?.roleLabel !== 'Admin Panel' && <SearchChatbot />}
    </div>
  );
}
