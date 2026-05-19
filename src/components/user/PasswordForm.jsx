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
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

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
    else if (form.newPassword.length < 9) errs.newPassword = 'Password must be at least 9 characters';
    else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.newPassword)) errs.newPassword = 'Must contain uppercase, number, and special char';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await profileService.changePassword(form);
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      onToast('Password changed successfully');
    } catch (err) { onToast(err?.response?.data?.message || 'Failed to change password', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div className="p-4 rounded-xl bg-[#0d1117]/50 border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#4A90E2]" />
          <p className="text-sm font-medium text-white">Password Requirements</p>
        </div>
        <ul className="space-y-1 text-xs text-[#8b949e]">
          {PWD_CHECKS.map(([test, label]) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${test(form.newPassword) ? 'bg-emerald-400' : 'bg-white/20'}`} />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <PasswordInput id="oldPassword" name="oldPassword" label="Current Password" value={form.oldPassword} onChange={handleChange} error={errors.oldPassword} />
      <PasswordInput id="newPassword" name="newPassword" label="New Password" value={form.newPassword} onChange={handleChange} error={errors.newPassword} autoComplete="new-password" />
      <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm New Password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
      <div className="pt-2 flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] disabled:opacity-50 transition-all shadow-lg shadow-[#4A90E2]/20">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}
