import { useState, useEffect } from 'react';
import { X, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROLES, ROLE_LABELS, ROLE_COLORS, USER_STATUS } from '@/constants/roles';
import { formatDate, timeAgo } from '@/utils/dateUtils';
import UserAvatar from '@/components/ui/UserAvatar';
import RoleIcon from '@/components/ui/RoleIcon';
import FormField from './FormField';
import TextInput from './TextInput';
import FieldView from './FieldView';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { getInitials } from '@/components/ui/UserAvatar';

const DESCS = {
  [ROLES.ADMIN]: 'Full system access',
  [ROLES.LECTURER]: 'Teaching & research',
  [ROLES.STUDENT]: 'Student access',
  [ROLES.RESEARCHER]: 'Research tools',
  [ROLES.USER]: 'Read-only access',
};

const ICONS = {
  mail: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  lock: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  shield: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  chart: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  user: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

export default function UserModal({ user, mode, onClose, onSave }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const [form, setForm] = useState({ mail: '', password: '', fullName: '', role: ROLES.USER, status: USER_STATUS.ACTIVE });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (user) {
      const role = user.role === ROLES.STUDENT ? ROLES.LECTURER : (user.role || ROLES.USER);
      setForm({ mail: user.mail || '', password: '', fullName: user.fullName || '', role, status: user.status || USER_STATUS.ACTIVE });
    }
    else setForm({ mail: '', password: '', fullName: '', role: ROLES.USER, status: USER_STATUS.ACTIVE });
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.mail.trim()) errs.mail = 'Required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) errs.mail = 'Invalid email.';
    if (isCreate && !form.password) errs.password = 'Required.';
    else if (form.password && form.password.length < 9) errs.password = 'Min 9 characters.';
    setErrors(errs);
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = Object.assign({}, prev); delete e[field]; return e; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(validate()).length > 0) return;
    setSaving(true); setServerError('');
    try {
      const p = { ...form };
      if (!p.password) delete p.password;
      onSave(p, user?.id);
    } catch (err) { setServerError(err.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const hdBg = isView ? 'bg-blue-500/10 border-blue-500/20' : isEdit ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-purple-500/10 border-purple-500/20';
  const stDot = { ACTIVE: 'bg-emerald-400', INACTIVE: 'bg-yellow-400', SUSPENDED: 'bg-red-400' };
  const identifier = user?.fullName || user?.mail;
  const initials = getInitials(identifier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg rounded-2xl bg-white border border-[#c6c6cd]/40 shadow-2xl shadow-black/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c6c6cd]/40">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hdBg}`}>{ICONS.chart}</div>
            <div><h2 className="text-sm font-bold text-[#0b1c30]">{isView ? 'User Details' : isEdit ? 'Edit User' : 'Create New User'}</h2><p className="text-[10px] text-[#76777d]">{isView ? 'View user profile' : isEdit ? 'Update information' : 'Add new user'}</p></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#76777d] hover:text-[#0b1c30] hover:bg-[#f8f9ff]"><X className="w-4 h-4" /></button>
        </div>
        {isView && user && (
          <div className="relative h-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-emerald-600/10 to-purple-600/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute bottom-3 left-6 flex items-center gap-3">
              <UserAvatar identifier={identifier} size="xl" className="border-2 border-white shadow-sm" />
              <div><h3 className="text-base font-bold text-[#0b1c30]">{user.fullName || user.mail}</h3><p className="text-xs text-[#76777d]">{user.mail}</p></div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          {serverError && <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"><div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-[8px] text-black font-bold">!</div><p className="text-sm text-red-400">{serverError}</p></div>}
          <FormField label="Email" icon={ICONS.mail} required>{isView ? <FieldView value={user?.mail} /> : <TextInput type="email" value={form.mail} onChange={(e) => handleChange('mail', e.target.value)} error={errors.mail} placeholder="user@example.com" />}</FormField>
          {(isCreate || isEdit) && (
            <FormField label="Full Name" icon={ICONS.user} required={isCreate}>
              <TextInput value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="John Doe" />
            </FormField>
          )}
          {(isCreate || isEdit) && (
            <FormField label={isCreate ? 'Password' : 'New Password'} icon={ICONS.lock} required={isCreate}>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={isEdit ? 'Keep current' : 'Min. 9 chars'}
                  className={`w-full pl-3 pr-10 py-2.5 rounded-xl text-sm text-[#0b1c30] bg-white border placeholder:text-[#76777d] focus:outline-none transition-all shadow-sm ${errors.password ? 'border-red-500/50' : 'border-[#c6c6cd]/60 focus:border-[#0058be]/50'}`} />
                <button type="button" onClick={() => setShowPwd((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#0b1c30]">{showPwd ? <EyeOff className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}</button>
              </div>
              {errors.password ? <p className="mt-1.5 text-xs text-red-400">{errors.password}</p> : isEdit && <p className="mt-1.5 text-xs text-[#76777d]">Leave blank to keep current.</p>}
            </FormField>
          )}
          <FormField label="Role" icon={ICONS.shield}>
            {isView ? (
              <div className="space-y-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${ROLE_COLORS[form.role]?.badge || ''}`}>{RoleIcon[form.role]}{form.role === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[form.role] || form.role}</span>
                <p className="text-xs text-[#76777d]">{DESCS[form.role]}</p>
              </div>
            ) : (
              <SelectDropdown
                value={form.role}
                onChange={(value) => handleChange('role', value)}
                options={Object.values(ROLES)
                  .filter(r => r !== ROLES.STUDENT && (isCreate || r !== ROLES.ADMIN || form.role === ROLES.ADMIN))
                  .map(r => ({ value: r, label: r === ROLES.LECTURER ? 'Student / Lecturer' : ROLE_LABELS[r] }))}
              />
            )}
          </FormField>
          {(isView || isEdit) && (
            <FormField label="Status" icon={ICONS.chart}>
              {isView ? (
                <div className="space-y-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${form.status === USER_STATUS.ACTIVE ? 'bg-emerald-500/10 text-emerald-600' : form.status === USER_STATUS.INACTIVE ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stDot[form.status] || 'bg-gray-400'}`} />{form.status}
                  </span>
                  {user?.lastLogin && <p className="text-xs text-[#76777d]">Last login: {timeAgo(user.lastLogin)}</p>}
                  {user?.createdAt && <p className="text-xs text-[#76777d]">Since: {formatDate(user.createdAt)}</p>}
                </div>
              ) : (
                <SelectDropdown
                  value={form.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: USER_STATUS.ACTIVE, label: 'Active' },
                    { value: USER_STATUS.INACTIVE, label: 'Inactive' },
                    { value: USER_STATUS.SUSPENDED, label: 'Suspended' },
                  ]}
                />
              )}
            </FormField>
          )}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#c6c6cd]/40">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#76777d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] border border-[#c6c6cd]/60">{isView ? 'Close' : 'Cancel'}</button>
            {!isView && (
              <button type="submit" disabled={saving}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 border ${isEdit ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-600/50 shadow-lg shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 border-blue-600/50 shadow-lg shadow-blue-600/20'}`}>
                {saving ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span> : isEdit ? 'Save Changes' : 'Create User'}
              </button>
            )}
          </div>
        </form>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </motion.div>
    </div>
  );
}
