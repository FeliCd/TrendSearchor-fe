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
    <aside className="flex flex-col h-full bg-[#151515] border-r border-gray-800 transition-all duration-300 w-[240px]">
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
            to={item.comingSoon ? '#' : item.to}
            end={item.end}
            onClick={(e) => {
              if (item.comingSoon) e.preventDefault();
            }}
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
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
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                      isActive && !item.comingSoon ? 'text-[#0058be]' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.comingSoon && (
                  <span className="text-[8px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-none border border-gray-700 tracking-wider flex-shrink-0">
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
