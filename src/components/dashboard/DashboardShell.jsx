import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import SearchChatbot from '@/components/chatbot/SearchChatbot';

export default function DashboardShell({ sidebarConfig, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex bg-[#151515] min-h-screen text-white relative overflow-x-hidden">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#151515] border-b border-gray-800 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="TrendSearchor" className="w-7 h-7 brightness-0 invert" />
          <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
            TrendSearchor
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop fixed + Mobile slide-over) */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-full">
          <DashboardSidebar config={sidebarConfig} onCloseMobile={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <main
        id="dashboard-main"
        className="flex-1 min-w-0 transition-all duration-300 scroll-smooth ml-0 lg:ml-[240px] pt-14 lg:pt-0"
      >
        {children || <Outlet />}
      </main>

      {sidebarConfig?.roleLabel !== 'Admin Panel' && <SearchChatbot />}
    </div>
  );
}
