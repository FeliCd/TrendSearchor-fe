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
    <div className="sm:hidden border-t border-[#c6c6cd]/40">
      <div className="px-0 py-3 space-y-3">
        <form onSubmit={handleSearch} className="flex items-center bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-lg overflow-hidden">
          <Search className="w-4 h-4 text-[#76777d] ml-3 flex-shrink-0 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent pl-2.5 pr-3 py-2.5 text-[#0b1c30] placeholder-[#76777d] text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 m-1 bg-[#e5eeff] text-[#0058be] hover:bg-[#d3e4fe] transition-colors text-xs font-medium rounded-md border border-[#c6c6cd]/30"
          >
            Go
          </button>
        </form>

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#f8f9ff] rounded-lg border border-[#c6c6cd]/40">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e5eeff] border border-[#c6c6cd]/50">
                <User className="w-4 h-4 text-[#0058be]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0b1c30] truncate">{user?.fullName || user?.mail || 'My Account'}</p>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="text-xs text-[#0058be] hover:text-[#004faf] transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all
                border border-[#c6c6cd]/40"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex gap-2 pt-2 border-t border-[#c6c6cd]/40">
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-medium text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-all
                border border-[#c6c6cd]/40"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                text-sm font-semibold text-white bg-[#0058be] hover:bg-[#004395] transition-all"
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
