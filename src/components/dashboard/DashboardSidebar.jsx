import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DashboardSidebar({ config }) {

  const {
    navItems,
    roleLabel,
    subtitle,
    accentColor,
  } = config;

  return (
    <aside className="flex flex-col h-full bg-[var(--dark-bg-base)] border-r border-gray-800 transition-all duration-300 w-[240px]">
      <div className="flex items-center h-[72px] px-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
            <img src="/logo.svg" alt="TrendSearchor" className="w-8 h-8 drop-shadow-sm brightness-0 invert" />
          </div>
          <div className="min-w-0 flex flex-col justify-center pt-0.5">
            <p className="text-[15px] font-bold text-white tracking-wide leading-none" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
              TrendSearchor
            </p>
              <div className="flex items-center mt-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
                  {roleLabel}
                </p>
              </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#0058be]/20 text-white border border-[#0058be]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-[#0058be]' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
