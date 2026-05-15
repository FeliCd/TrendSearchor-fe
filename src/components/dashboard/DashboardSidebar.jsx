import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ChevronLeft } from 'lucide-react';

export default function DashboardSidebar({ collapsed, onToggle, config }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    navItems,
    roleLabel,
    subtitle,
    accentColor,
    avatarBgColor,
  } = config;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeClasses = (isActive) =>
    `bg-${accentColor}/10 text-${accentColor} border border-${accentColor}/20`;

  const inactiveClasses =
    'text-[#8b949e] hover:text-white hover:bg-white/5 border border-transparent';

  return (
    <aside
      className={`flex flex-col h-full bg-[#0d1117]/95 border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${accentColor}/10 border border-${accentColor}/20 flex-shrink-0`}
          >
            <config.HeaderIcon className={`w-4 h-4 text-${accentColor}`} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{roleLabel}</p>
              <p className="text-[10px] text-[#8b949e] truncate">{subtitle}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? activeClasses(isActive) : inactiveClasses
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? `text-${accentColor}` : 'text-[#8b949e] group-hover:text-white'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="absolute left-[68px] ml-2 px-2 py-1 bg-[#161b22] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full ${avatarBgColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
            >
              {user?.username?.[0]?.toUpperCase() || roleLabel[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.username || roleLabel}
              </p>
              <p className="text-[10px] text-[#8b949e] truncate">{roleLabel}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
