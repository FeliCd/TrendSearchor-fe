import { Menu, X, LogIn, UserPlus, User, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, ROLE_LABELS } from '@/constants/roles';
import { getDashboardPath } from '@/utils/roleUtils';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowUserMenu(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardPath = user ? getDashboardPath(user.role) : '/dashboard';

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 mx-auto w-full sm:w-fit transition-all duration-300">
      <div className={`bg-white/80 backdrop-blur-xl border border-[#c6c6cd]/40 rounded-2xl shadow-lg transition-all duration-300 ${scrolled ? 'shadow-black/10 bg-white/95' : 'shadow-black/5'}`}>
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 gap-4 sm:gap-8">

          <Link to="/" className="group flex-shrink-0">
            <Logo variant="navbar" />
          </Link>

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-[#f8f9ff] border border-[#c6c6cd]/50 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f8f9ff] border border-[#c6c6cd]/50 hover:border-[#0058be]/40 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0058be]/50"
                >
                  <User className="w-5 h-5 text-[#45464d]" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#c6c6cd]/60 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-[#c6c6cd]/30">
                      <p className="text-sm font-semibold text-[#0b1c30]">{user.mail}</p>
                      <p className="text-xs text-[#76777d] mt-0.5">{ROLE_LABELS[user.role] || user.role}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={dashboardPath}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={`${dashboardPath}/profile`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-colors"
                      >
                        <UserCircle className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                    text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                    text-white bg-[#0058be] hover:bg-[#004395] transition-all duration-300
                    shadow-sm shadow-[#0058be]/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <MobileMenu
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            isAuthenticated={!!user}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
