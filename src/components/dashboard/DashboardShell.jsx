import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import SearchChatbot from '@/components/chatbot/SearchChatbot';

export default function DashboardShell({ sidebarConfig, children }) {

  return (
    <div className="flex bg-[#151515] min-h-screen text-white">
      <div className="fixed inset-y-0 left-0 z-40 flex-shrink-0">
        <div className="flex h-full">
          <DashboardSidebar config={sidebarConfig} />
        </div>
      </div>

      <main
        id="dashboard-main"
        className="flex-1 min-w-0 transition-all duration-300 scroll-smooth ml-[240px]"
      >
        {children || <Outlet />}
      </main>

      <SearchChatbot />
    </div>
  );
}
