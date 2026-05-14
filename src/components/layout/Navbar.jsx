import { Menu, X, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavbarSearchBar from './NavbarSearchBar';
import MobileMenu from './MobileMenu';
import { authService } from '@/services/authService';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowUserMenu(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
    
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
    await authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 mx-auto w-full sm:w-fit transition-all duration-300">
      <div className={`bg-[#0d1117]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl transition-all duration-300 ${scrolled ? 'shadow-black/50 bg-[#0d1117]/95' : 'shadow-black/20'}`}>
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 gap-4 sm:gap-8">

          <Link to="/" className="group flex-shrink-0">
            <Logo variant="navbar" />
          </Link>

          <NavbarSearchBar scrolled={scrolled} />

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#161b22] border border-white/10 hover:border-white/20 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50"
                >
                  <User className="w-5 h-5 text-[#8b949e]" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">My Account</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-[#e6edf3] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 text-sm text-[#f85149] hover:text-[#ff7b72] hover:bg-white/5 transition-colors flex items-center gap-2"
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
                    text-[#8b949e] hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                    text-white bg-[#4A90E2] hover:bg-[#357ABD] transition-all duration-300
                    shadow-lg shadow-[#4A90E2]/20 border border-[#4A90E2]/50 hover:border-[#4A90E2]"
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
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />}
      </div>
    </div>
  );
}
