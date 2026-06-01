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
  const avatarBgColor = config?.avatarBgColor || 'bg-gray-500';
  const roleLabel = config?.roleLabel || 'User';
  return (
    <div className="h-[72px] border-b border-[#c6c6cd]/40 bg-white/70 backdrop-blur-xl sticky top-0 z-20 flex items-center">
      <div className="w-full px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#0b1c30]">{title}</h1>
              <div className="h-5 w-px bg-[#c6c6cd]/60 hidden sm:block" />
              {description && (
                <p className="text-sm text-[#76777d] hidden sm:block">{description}</p>
              )}
            </div>
            {description && (
              <p className="text-sm text-[#76777d] mt-0.5 sm:hidden">{description}</p>
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
            
            {(action || true) && <div className="h-6 w-px bg-[#c6c6cd]/60 hidden sm:block" />}

            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="md" className="border border-[#c6c6cd]/40 shadow-sm" />
              <div className="hidden md:block min-w-0">
                <p className="text-sm font-bold text-[#0b1c30] truncate">
                  {user?.fullName || user?.mail || roleLabel}
                </p>
                <p className="text-[11px] font-medium text-[#76777d] truncate uppercase tracking-wider">{roleLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-xl text-[#76777d] hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 shadow-sm border border-transparent hover:border-red-100"
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
