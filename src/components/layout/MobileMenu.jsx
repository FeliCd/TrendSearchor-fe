import { Link } from 'react-router-dom';
import { Search, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function MobileMenu({ onClose, isAuthenticated, user, onLogout }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      onClose();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onLogout();
      onClose();
    }
  };

  return (
    <div className="sm:hidden border-t border-white/[0.06]">
      <div className="px-0 py-3 space-y-3">
        <form onSubmit={handleSearch} className="flex items-center bg-[#161b22] border border-white/10 rounded-lg overflow-hidden">
          <Search className="w-4 h-4 text-[#8b949e] ml-3 flex-shrink-0 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent pl-2.5 pr-3 py-2.5 text-[#e6edf3] placeholder-[#8b949e] text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 m-1 bg-[#21262d] text-[#8b949e] text-xs font-medium rounded-md border border-white/10"
          >
            Go
          </button>
        </form>

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] rounded-lg border border-white/6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#161b22] border border-white/10">
                <User className="w-4 h-4 text-[#8b949e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username || 'My Account'}</p>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="text-xs text-[#4A90E2] hover:text-[#6ba3e0] transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-medium text-[#f85149] hover:text-[#ff7b72] hover:bg-white/[0.06] transition-all
                border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all
                border border-white/10"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-semibold text-[#0d1117] bg-white hover:bg-white/90 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
