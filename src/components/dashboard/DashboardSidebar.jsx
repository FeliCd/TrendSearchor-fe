import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardSidebar({ config, collapsed, onToggleCollapse }) {
  const { navItems, roleLabel } = config;

  return (
    <aside className={`flex flex-col h-full bg-[#151515] border-r border-gray-800 transition-all duration-300 ${
      collapsed ? 'w-16 sm:w-20' : 'w-16 sm:w-20 lg:w-[240px]'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center h-[72px] px-3 lg:px-6 border-b border-gray-800 flex-shrink-0 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
            <img src="/logo.svg" alt="TrendSearchor" className="w-8 h-8 drop-shadow-sm brightness-0 invert" />
          </div>
          <div className={`min-w-0 flex flex-col justify-center pt-0.5 ${collapsed ? 'hidden' : 'hidden lg:flex'}`}>
            <p className="text-[15px] font-bold text-white tracking-wide leading-none" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
              TrendSearchor
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate mt-1">
              {roleLabel}
            </p>
          </div>
        </div>
        
        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-7 h-7 border border-gray-800 bg-[#1e1e1e] text-gray-400 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.comingSoon ? '#' : item.to}
            end={item.end}
            title={item.label}
            onClick={(e) => {
              if (item.comingSoon) e.preventDefault();
            }}
            className={({ isActive }) =>
              `group relative flex items-center ${collapsed ? 'justify-center' : 'justify-center lg:justify-between'} px-3 lg:px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive && !item.comingSoon
                  ? 'bg-[#1e1e1e] text-white border-2 border-[#0058be]'
                  : item.comingSoon
                    ? 'text-gray-600 border-2 border-transparent cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e] border-2 border-transparent hover:border-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-5 h-5 lg:w-4 lg:h-4 flex-shrink-0 transition-colors duration-200 ${
                      isActive && !item.comingSoon ? 'text-[#0058be]' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  <span className={`truncate ${collapsed ? 'hidden' : 'hidden lg:inline'}`}>{item.label}</span>
                </div>
                {item.comingSoon && !collapsed && (
                  <span className="hidden lg:inline text-[8px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-none border border-gray-700 tracking-wider flex-shrink-0">
                    SOON
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
