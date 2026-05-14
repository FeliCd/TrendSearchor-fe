import { Search, Bell, BookOpen, TrendingUp, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Trends', href: '/trends', icon: TrendingUp },
  { label: 'Search', href: '/search', icon: Search },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:bg-primary-500 transition-colors">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[#e6edf3] tracking-tight">
              Trend<span className="text-primary-400">Scholar</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  pathname === href
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/5 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>
            <Link to="/login" className="hidden md:block btn-secondary text-xs px-4 py-2">
              Sign in
            </Link>
            <Link to="/register" className="hidden md:block btn-primary text-xs px-4 py-2">
              Get started
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-[#8b949e] hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#21262d] py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/5 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
