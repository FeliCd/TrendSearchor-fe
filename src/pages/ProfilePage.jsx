import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Calendar, Shield, Key, Loader2, CheckCircle, XCircle, Save } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const [profileForm, setProfileForm] = useState({
    username: '',
    mail: '',
    dob: '',
    phone: '',
    gender: '',
    workplace: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfileForm({
        username: data.username || '',
        mail: data.mail || '',
        dob: data.dob || '',
        phone: data.phone || '',
        gender: data.gender || '',
        workplace: data.workplace || '',
      });
    } catch (err) {
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.username || profileForm.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!profileForm.mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.mail)) {
      newErrors.mail = 'Valid email is required';
    }
    if (profileForm.phone && !/^0\d{9}$/.test(profileForm.phone)) {
      newErrors.phone = 'Phone must be 10 digits starting with 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 9) {
      newErrors.newPassword = 'Password must be at least 9 characters';
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'Must contain uppercase, number, and special char';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const updated = await profileService.updateProfile(profileForm);
      setProfileForm({
        username: updated.username || '',
        mail: updated.mail || '',
        dob: updated.dob || '',
        phone: updated.phone || '',
        gender: updated.gender || '',
        workplace: updated.workplace || '',
      });
      await refreshUser();
      showToast('Profile updated successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to update profile';
      if (typeof msg === 'object') {
        const firstError = Object.values(msg)[0];
        showToast(firstError, 'error');
      } else {
        showToast(typeof msg === 'string' ? msg : 'Failed to update profile', 'error');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await profileService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to change password';
      if (typeof msg === 'object') {
        const firstError = Object.values(msg)[0];
        showToast(firstError, 'error');
      } else {
        showToast(typeof msg === 'string' ? msg : 'Failed to change password', 'error');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'password', label: 'Change Password', icon: Key },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="My Profile"
      description="Manage your personal information and security settings."
    >
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-[slideInRight_0.3s_ease-out] ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl">
        <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#4A90E2] border-b-2 border-[#4A90E2] bg-white/[0.02]'
                    : 'text-[#8b949e] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1117]/50 border border-white/5">
                  <div className="w-16 h-16 rounded-full bg-[#4A90E2]/10 border-2 border-[#4A90E2]/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#4A90E2]">
                      {user?.username?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{user?.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user?.role]?.badge || 'bg-white/5 text-[#8b949e]'}`}>
                        {ROLE_LABELS[user?.role] || user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormInput
                    id="username"
                    name="username"
                    label="Username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    error={errors.username}
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  />

                  <FormInput
                    id="mail"
                    name="mail"
                    type="email"
                    label="Email"
                    value={profileForm.mail}
                    onChange={handleProfileChange}
                    error={errors.mail}
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  />

                  <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone"
                    placeholder="0912345678"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    error={errors.phone}
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                  />

                  <FormInput
                    id="workplace"
                    name="workplace"
                    label="Workplace"
                    placeholder="FPT University"
                    value={profileForm.workplace}
                    onChange={handleProfileChange}
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  />

                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="text-sm font-medium text-[#c9d1d9]">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-[#8b949e]" />
                      </div>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profileForm.dob || ''}
                        onChange={handleProfileChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-lg text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="gender" className="text-sm font-medium text-[#c9d1d9]">Gender</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-[#8b949e]" />
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        value={profileForm.gender || ''}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-lg text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50 appearance-none cursor-pointer"
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#4A90E2]/20"
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                <div className="p-4 rounded-xl bg-[#0d1117]/50 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[#4A90E2]" />
                    <p className="text-sm font-medium text-white">Password Requirements</p>
                  </div>
                  <ul className="space-y-1 text-xs text-[#8b949e]">
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwordForm.newPassword.length >= 9 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      At least 9 characters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*[A-Z])/.test(passwordForm.newPassword) ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(passwordForm.newPassword) ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      One number
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(passwordForm.newPassword) ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      One special character
                    </li>
                  </ul>
                </div>

                <PasswordInput
                  id="oldPassword"
                  name="oldPassword"
                  label="Current Password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.oldPassword}
                />

                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  autoComplete="new-password"
                />

                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  autoComplete="new-password"
                />

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#4A90E2]/20"
                  >
                    {savingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
