import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2, Save, Calendar, User } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { profileService } from '@/services/profileService';
import { ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';

export default function ProfileForm({ initialProfile, onSuccess, onToast }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    username: initialProfile?.username || '', mail: initialProfile?.mail || '',
    dob: initialProfile?.dob || '', phone: initialProfile?.phone || '',
    gender: initialProfile?.gender || '', workplace: initialProfile?.workplace || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = Object.assign({}, prev); delete n[name]; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.username || form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) errs.mail = 'Valid email is required';
    if (form.phone && !/^0\d{9}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits starting with 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(form);
      setForm({ username: updated.username || '', mail: updated.mail || '', dob: updated.dob || '', phone: updated.phone || '', gender: updated.gender || '', workplace: updated.workplace || '' });
      onSuccess();
      onToast('Profile updated successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data;
      onToast(typeof msg === 'string' ? msg : Object.values(msg || {})[0] || 'Failed to update profile', 'error');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1117]/50 border border-white/5">
        <div className="w-16 h-16 rounded-full bg-[#4A90E2]/10 border-2 border-[#4A90E2]/30 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#4A90E2]">{user?.username?.charAt(0)?.toUpperCase() || '?'}</span>
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
        <FormInput id="username" name="username" label="Username" value={form.username} onChange={handleChange} error={errors.username} />
        <FormInput id="mail" name="mail" type="email" label="Email" value={form.mail} onChange={handleChange} error={errors.mail} />
        <FormInput id="phone" name="phone" type="tel" label="Phone" placeholder="0912345678" value={form.phone} onChange={handleChange} error={errors.phone} />
        <FormInput id="workplace" name="workplace" label="Workplace" placeholder="FPT University" value={form.workplace} onChange={handleChange} />
        <DateField value={form.dob} onChange={handleChange} />
        <GenderField value={form.gender} onChange={handleChange} />
      </div>
      <div className="pt-2 flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] disabled:opacity-50 transition-all shadow-lg shadow-[#4A90E2]/20">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function DateField({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#c9d1d9]">Date of Birth</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Calendar className="w-4 h-4 text-[#8b949e]" /></div>
        <input name="dob" type="date" value={value || ''} onChange={onChange} max={new Date().toISOString().split('T')[0]}
          className="w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-lg text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50" />
      </div>
    </div>
  );
}

function GenderField({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#c9d1d9]">Gender</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User className="w-4 h-4 text-[#8b949e]" /></div>
        <select name="gender" value={value || ''} onChange={onChange}
          className="w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-lg text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50 appearance-none cursor-pointer">
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHERS">Other</option>
        </select>
      </div>
    </div>
  );
}
