import { useState, useEffect } from 'react';
import { RefreshCw, Key, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/ui/DashboardLayout';
import Toast from '@/components/ui/Toast';
import ProfileForm from '@/components/shared/ProfileForm';
import RoleSwitcher from '@/components/shared/RoleSwitcher';
import PasswordForm from '@/components/shared/PasswordForm';
import { profileService } from '@/services/profileService';
import { ROLE_LABELS } from '@/constants/roles';
import { getDashboardPath } from '@/utils/roleUtils';
import { useAuth } from '@/contexts/AuthContext';
import UserStatsCard from '@/components/shared/UserStatsCard';
import ConnectedAccounts from '@/components/shared/ConnectedAccounts';
import RecentDevices from '@/components/shared/RecentDevices';



export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    profileService.getProfile()
      .then((data) => setProfile(data))
      .catch(() => showToast('Failed to load profile', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#0058be] animate-spin" />
    </div>;
  }

  const handleRoleSwitch = (role) => {
    showToast(`Role changed to ${ROLE_LABELS[role]}. Redirecting...`);
    navigate(getDashboardPath(role), { replace: true });
  };

  return (
    <DashboardLayout title="My Profile" description="Manage your personal information and security settings.">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (40%) - Profile Information & Connected Accounts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[var(--dark-bg-base)] border border-gray-800 shadow-sm rounded-2xl p-6">
            <ProfileForm initialProfile={profile} onSuccess={refreshUser} onToast={showToast} />
          </div>
          <div className="rounded-2xl flex-1">
            <ConnectedAccounts />
          </div>
        </div>

        {/* Right Column (60%) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Top 30% - Stats */}
          <div>
            <UserStatsCard />
          </div>

          {/* Bottom 70% - Account Type & Security side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--dark-bg-base)] border border-gray-800 shadow-sm rounded-2xl p-6 flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#0058be]" />
                Account Type
              </h2>
              <div>
                <RoleSwitcher onSwitch={handleRoleSwitch} onToast={showToast} />
              </div>
            </div>

            <div className="bg-[var(--dark-bg-base)] border border-gray-800 shadow-sm rounded-2xl p-6 flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0058be]" />
                Security &amp; Password
              </h2>
              <div>
                <PasswordForm onToast={showToast} />
              </div>
            </div>
          </div>

          {/* Bottom Area - Recent Devices */}
          <div className="rounded-2xl flex-1">
            <RecentDevices />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
