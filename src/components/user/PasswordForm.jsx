import { useState } from 'react';
import { Shield, Loader2, Key } from 'lucide-react';
import PasswordInput from '@/components/ui/PasswordInput';
import { profileService } from '@/services/profileService';

const PWD_CHECKS = [
  [(v) => v.length >= 9, 'At least 9 characters'],
  [(v) => /[A-Z]/.test(v), 'One uppercase letter'],
  [(v) => /\d/.test(v), 'One number'],
  [(v) => /[!@#$%^&*(),.?":{}|<>]/.test(v), 'One special character'],
];

export default function PasswordForm({ onToast }) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const n = Object.assign({}, prev);
      n[name] = value;
      return n;
    });
    if (errors[name]) {
      const n = Object.assign({}, errors);
      delete n[name];
      setErrors(n);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.oldPassword) errs.oldPassword = 'Current password is required';
    if (!form.newPassword) errs.newPassword = 'New password is required';
    else if (!PWD_CHECKS.every(([test]) => test(form.newPassword))) errs.newPassword = 'Password does not meet requirements';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await profileService.changePassword(form);
      setForm({ oldPassword: '', newPassword: '' });
      onToast('Password changed successfully');
    } catch (err) { onToast(err?.response?.data?.message || 'Failed to change password', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="px-4 py-3 rounded-xl bg-[#f8f9ff] border border-[#c6c6cd]/40">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#0058be]" />
          <p className="text-sm font-bold text-[#0b1c30]">Password Requirements</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-[#76777d]">
          {PWD_CHECKS.map(([test, label]) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${test(form.newPassword) ? 'bg-emerald-500' : 'bg-[#c6c6cd]'}`} />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <PasswordInput id="oldPassword" name="oldPassword" label="Current Password" value={form.oldPassword} onChange={handleChange} error={errors.oldPassword} autoComplete="current-password" />
      <PasswordInput id="newPassword" name="newPassword" label="New Password" value={form.newPassword} onChange={handleChange} error={errors.newPassword} autoComplete="new-password" />
      <div className="pt-1 flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0058be] hover:bg-[#004395] disabled:opacity-50 transition-all shadow-sm shadow-[#0058be]/20">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}
