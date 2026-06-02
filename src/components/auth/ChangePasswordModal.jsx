import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { authService } from '@/services/authService';
import Logo from '@/components/layout/Logo';

export default function ChangePasswordModal({ isOpen, user, onSuccess }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const PASSWORD_RULES = [
    { id: 'length', label: 'At least 9 characters', test: (v) => v.length >= 9 },
    { id: 'upper', label: '1 uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { id: 'number', label: '1 number', test: (v) => /\d/.test(v) },
    { id: 'special', label: '1 special character', test: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
  ];

  const validate = () => {
    const errs = {};
    if (!oldPassword.trim()) errs.oldPassword = 'Current password is required';
    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (PASSWORD_RULES.some((r) => !r.test(newPassword))) {
      errs.newPassword = 'Password does not meet requirements';
    }
    if (newPassword && newPassword === oldPassword) {
      errs.newPassword = 'New password must be different from current password';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      onSuccess?.();
    } catch (err) {
      const data = err?.response?.data;
      if (typeof data === 'string') {
        setGlobalError(data);
      } else if (data?.oldPassword) {
        setErrors({ oldPassword: data.oldPassword });
      } else if (data?.message) {
        setGlobalError(data.message);
      } else {
        setGlobalError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const metCount = PASSWORD_RULES.filter((r) => r.test(newPassword)).length;
  const allMet = metCount === PASSWORD_RULES.length;
  const passwordsMatch = confirmPassword && confirmPassword === newPassword;

  /* Eye icons matching LoginPage exactly */
  const EyeOpen = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  const EyeClosed = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
  const LockIcon = (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
  const KeyIcon = (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  );
  const ShieldIcon = (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
  const ArrowIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#151515] p-6 text-white selection:bg-[#1231f4] selection:text-white overflow-y-auto"
        >
          {/* Background grid — identical to AuthLayout */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[480px] relative z-10 flex flex-col"
          >
            {/* Logo */}
            <div className="flex items-center justify-center mb-10">
              <Logo variant="navbar" className="scale-125" />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                Change your password
              </h1>
              <p className="text-sm font-medium text-gray-400">
                Your password was reset by an administrator. Set a new password to continue.
              </p>
            </div>

            {/* Global error */}
            {globalError && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-[#1e1e1e] border-2 border-red-500/40">
                <div className="w-8 h-8 flex-shrink-0 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-400">{globalError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="cp-old" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {LockIcon}
                  </div>
                  <input
                    id="cp-old"
                    type={showOld ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    autoFocus
                    className={`w-full pl-11 pr-11 py-3 bg-[#1e1e1e] border-2 text-white font-medium
                      placeholder:text-gray-600 focus:outline-none transition-all
                      ${errors.oldPassword ? 'border-red-500/60' : 'border-gray-800 focus:border-[#0058be]'}`}
                  />
                  <button type="button" onClick={() => setShowOld(!showOld)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showOld ? EyeClosed : EyeOpen}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-xs font-medium text-red-400 mt-2">{errors.oldPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="cp-new" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {KeyIcon}
                  </div>
                  <input
                    id="cp-new"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: '' })); }}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-3 bg-[#1e1e1e] border-2 text-white font-medium
                      placeholder:text-gray-600 focus:outline-none transition-all
                      ${errors.newPassword ? 'border-red-500/60' : 'border-gray-800 focus:border-[#0058be]'}`}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showNew ? EyeClosed : EyeOpen}
                  </button>
                </div>
                {errors.newPassword && <p className="text-xs font-medium text-red-400 mt-2">{errors.newPassword}</p>}

                {/* Password rules */}
                {newPassword && (
                  <div className="mt-3 px-4 py-3 bg-[#1e1e1e] border-2 border-gray-800">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex items-center pointer-events-none">{ShieldIcon}</div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Requirements</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {PASSWORD_RULES.map((rule) => {
                        const met = rule.test(newPassword);
                        return (
                          <div key={rule.id} className="flex items-center gap-2">
                            <div className={`w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                              met ? 'bg-emerald-500' : 'bg-gray-800 border border-gray-700'
                            }`}>
                              {met && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-xs font-medium transition-colors ${met ? 'text-emerald-400' : 'text-gray-500'}`}>
                              {rule.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Strength bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-800 overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            metCount <= 1 ? 'bg-red-500' : metCount === 2 ? 'bg-orange-500' : metCount === 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(metCount / PASSWORD_RULES.length) * 100}%` }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        metCount <= 1 ? 'text-red-400' : metCount === 2 ? 'text-orange-400' : metCount === 3 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {metCount <= 1 ? 'Weak' : metCount === 2 ? 'Fair' : metCount === 3 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="cp-confirm" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {LockIcon}
                  </div>
                  <input
                    id="cp-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-3 bg-[#1e1e1e] border-2 text-white font-medium
                      placeholder:text-gray-600 focus:outline-none transition-all
                      ${errors.confirmPassword ? 'border-red-500/60' : passwordsMatch ? 'border-emerald-500/60' : 'border-gray-800 focus:border-[#0058be]'}`}
                  />
                  {passwordsMatch ? (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                        <Check className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                      </motion.div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showConfirm ? EyeClosed : EyeOpen}
                    </button>
                  )}
                </div>
                {errors.confirmPassword && <p className="text-xs font-medium text-red-400 mt-2">{errors.confirmPassword}</p>}
                {passwordsMatch && <p className="text-xs font-medium text-emerald-400 mt-2">Passwords match</p>}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !allMet}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-black uppercase tracking-widest text-sm
                    hover:bg-gray-200 active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Updating password...</span>
                    </span>
                  ) : (
                    <>
                      Update Password
                      {ArrowIcon}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
