import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ROLE_SIDEBAR_CONFIG } from '@/constants/sidebarConfig';
import UserAvatar from '@/components/ui/UserAvatar';

export default function PageHeader({ title, description, action, actionLabel, onAction }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const config = user?.role ? ROLE_SIDEBAR_CONFIG[user.role] : ROLE_SIDEBAR_CONFIG.USER;
  const roleLabel = config?.roleLabel || 'User';
  return (
    <div className="h-[72px] border-b border-gray-800 bg-[var(--dark-bg-base)]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center">
      <div className="w-full px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <div className="h-5 w-px bg-gray-700 hidden sm:block" />
              {description && (
                <p className="text-sm text-gray-400 hidden sm:block">{description}</p>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-400 mt-0.5 sm:hidden">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {action && (
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onAction}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                  bg-[#0058be] hover:bg-[#004395] text-white transition-all duration-200
                  shadow-sm shadow-[#0058be]/20"
              >
                {action}
                <span>{actionLabel}</span>
              </motion.button>
            )}
            
            {(action || true) && <div className="h-6 w-px bg-gray-700 hidden sm:block" />}

            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="md" className="border border-gray-700 shadow-sm" />
              <div className="hidden md:block min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.fullName || user?.mail || roleLabel}
                </p>
                <p className="text-[11px] font-medium text-gray-500 truncate uppercase tracking-wider">{roleLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 border border-transparent hover:border-red-500/20"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
