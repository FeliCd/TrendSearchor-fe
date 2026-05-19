import { useState, useEffect } from 'react';
import { User, RefreshCw, Key, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/ui/DashboardLayout';
import Toast from '@/components/ui/Toast';
import ProfileForm from '@/components/user/ProfileForm';
import RoleSwitcher from '@/components/user/RoleSwitcher';
import PasswordForm from '@/components/user/PasswordForm';
import { profileService } from '@/services/profileService';
import { ROLE_LABELS } from '@/constants/roles';
import { getDashboardPath } from '@/utils/roleUtils';
import { useAuth } from '@/contexts/AuthContext';

const TABS = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'role', label: 'Account Type', icon: RefreshCw },
  { id: 'password', label: 'Change Password', icon: Key },
];

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('profile');
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
    return <div className="min-h-screen bg-[#010409] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
    </div>;
  }

  const handleRoleSwitch = (role) => {
    showToast(`Role changed to ${ROLE_LABELS[role]}. Redirecting...`);
    navigate(getDashboardPath(role), { replace: true });
  };

  return (
    <DashboardLayout title="My Profile" description="Manage your personal information and security settings.">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="max-w-3xl">
        <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                  tab === t.id ? 'text-[#4A90E2] border-b-2 border-[#4A90E2] bg-white/[0.02]' : 'text-[#8b949e] hover:text-white hover:bg-white/[0.03]'
                }`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'profile' && <ProfileForm initialProfile={profile} onSuccess={refreshUser} onToast={showToast} />}
            {tab === 'role' && <RoleSwitcher onSwitch={handleRoleSwitch} onToast={showToast} />}
            {tab === 'password' && <PasswordForm onToast={showToast} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
