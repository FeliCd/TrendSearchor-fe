import { NavLink } from 'react-router-dom';

export default function DashboardSidebar({ config }) {

  const {
    navItems,
    roleLabel,
    subtitle,
    accentColor,
  } = config;

  const activeClasses = (isActive) =>
    `bg-${accentColor}/10 text-${accentColor} border border-${accentColor}/20`;

  const inactiveClasses =
    'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] border border-transparent';

  return (
    <aside className="flex flex-col h-full bg-white border-r border-[#c6c6cd]/40 transition-all duration-300 shadow-sm w-[240px]">
      <div className="flex items-center h-[72px] px-6 border-b border-[#c6c6cd]/40 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
            <img src="/logo.svg" alt="TrendSearchor" className="w-8 h-8 drop-shadow-sm" />
          </div>
          <div className="min-w-0 flex flex-col justify-center pt-0.5">
            <p className="text-[15px] font-bold text-[#0b1c30] tracking-wide leading-none" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
              trendsearchor
            </p>
              <div className="flex items-center mt-1">
                <p className={`text-[10px] font-bold text-[#76777d] uppercase tracking-wider truncate`}>
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
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? activeClasses(isActive) : inactiveClasses
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? `text-${accentColor}` : 'text-[#76777d] group-hover:text-[#0b1c30]'
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
