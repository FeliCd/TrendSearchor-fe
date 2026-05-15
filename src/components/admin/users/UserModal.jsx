import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ROLES, ROLE_LABELS, ROLE_COLORS, USER_STATUS } from '@/constants/roles';

const initialForm = {
  username: '',
  mail: '',
  password: '',
  role: ROLES.USER,
  status: USER_STATUS.ACTIVE,
};

export default function UserModal({ user, mode, onClose, onSave }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        mail: user.mail || '',
        password: '',
        role: user.role || ROLES.USER,
        status: user.status || USER_STATUS.ACTIVE,
      });
    } else {
      setForm(initialForm);
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required.';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters.';
    if (!form.mail.trim()) errs.mail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) errs.mail = 'Invalid email address.';
    if (isCreate && !form.password) errs.password = 'Password is required.';
    else if (form.password && form.password.length < 9)
      errs.password = 'Password must be at least 9 characters.';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    setServerError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      onSave(payload, user?.id);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1117] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">
            {isView ? 'User Details' : isEdit ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {serverError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase tracking-wider">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              disabled={isView}
              placeholder="e.g. john_doe"
              className={`w-full px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border placeholder:text-[#8b949e]/40
                focus:outline-none transition-all
                ${errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#4A90E2]/50'}
                ${isView ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase tracking-wider">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.mail}
              onChange={(e) => handleChange('mail', e.target.value)}
              disabled={isView}
              placeholder="e.g. user@example.com"
              className={`w-full px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border placeholder:text-[#8b949e]/40
                focus:outline-none transition-all
                ${errors.mail ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#4A90E2]/50'}
                ${isView ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {errors.mail && <p className="mt-1 text-xs text-red-400">{errors.mail}</p>}
          </div>

          {isCreate || isEdit ? (
            <div>
              <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase tracking-wider">
                {isCreate ? 'Password' : 'New Password'}
                {isCreate && <span className="text-red-400"> *</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 9 chars, 1 uppercase, 1 number, 1 special'}
                  className={`w-full px-3 py-2.5 pr-10 rounded-xl text-sm text-white bg-[#161b22] border placeholder:text-[#8b949e]/40
                    focus:outline-none transition-all
                    ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#4A90E2]/50'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              {isEdit && (
                <p className="mt-1 text-xs text-[#8b949e]">Leave blank to keep the current password.</p>
              )}
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase tracking-wider">
              Role
            </label>
            {isView ? (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[form.role]?.badge || ''}`}>
                {ROLE_LABELS[form.role] || form.role}
              </span>
            ) : (
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border border-white/[0.08]
                  focus:outline-none focus:border-[#4A90E2]/50 cursor-pointer transition-all appearance-none"
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            )}
          </div>

          {isView || isEdit ? (
            <div>
              <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase tracking-wider">
                Status
              </label>
              {isView ? (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium
                  ${form.status === USER_STATUS.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : form.status === USER_STATUS.INACTIVE ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {form.status}
                </span>
              ) : (
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22] border border-white/[0.08]
                    focus:outline-none focus:border-[#4A90E2]/50 cursor-pointer transition-all appearance-none"
                >
                  <option value={USER_STATUS.ACTIVE}>Active</option>
                  <option value={USER_STATUS.INACTIVE}>Inactive</option>
                  <option value={USER_STATUS.SUSPENDED}>Suspended</option>
                </select>
              )}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#8b949e]
                hover:text-white hover:bg-white/5 border border-white/[0.08] transition-all"
            >
              {isView ? 'Close' : 'Cancel'}
            </button>
            {!isView && (
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD]
                  disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
                  shadow-lg shadow-[#4A90E2]/20 border border-[#4A90E2]/50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? 'Save Changes' : 'Create User'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
