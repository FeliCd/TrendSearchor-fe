import { useState } from 'react';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User, Mail, Lock, Phone, Calendar, Building2 } from 'lucide-react';

/* ── Step indicator ────────────────────────────────────────── */
function Steps({ current }) {
  const steps = ['Account', 'Details'];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const isDone = num < current;
        const isActive = num === current;
        return (
          <div key={num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
              isDone ? 'bg-[#73b797]/20 text-[#73b797] border border-[#73b797]/40' :
              isActive ? 'bg-[#73b797] text-white' :
              'bg-[#21262d] text-[#8b949e] border border-[#21262d]'
            }`}>
              {isDone ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : num}
            </div>
            <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-[#73b797]' : 'text-[#8b949e]'}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${isDone ? 'bg-[#73b797]/40' : 'bg-[#21262d]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Field ─────────────────────────────────────────────────── */
function Field({ id, name, label, type = 'text', placeholder, value, onChange, icon: Icon, error, helperText, autoComplete, autoFocus }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password' || name === 'confirmPassword';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#c9d1d9] mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`w-4 h-4 ${error ? 'text-red-400/70' : 'text-[#8b949e]'}`} />
          </div>
        )}
        <input
          id={id} name={name} type={inputType}
          placeholder={placeholder} value={value} onChange={onChange}
          autoComplete={autoComplete || name} autoFocus={autoFocus}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 bg-[#161b22] border rounded-lg text-sm text-[#e6edf3]
            placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all ${
              error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50' :
              'border-white/10 focus:ring-[#73b797]/50 focus:border-[#73b797]/50'
            }`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
            {show ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-[#8b949e]'}`}>{error || helperText}</p>
      )}
    </div>
  );
}

/* ── Select ───────────────────────────────────────────────── */
function Select({ id, name, label, value, onChange, options, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#c9d1d9] mb-1.5">{label}</label>
      <div className="relative">
        <select id={id} name={name} value={value} onChange={onChange}
          className={`w-full pl-4 pr-10 py-2.5 bg-[#161b22] border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all ${
            error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50 text-red-400' :
            'border-white/10 focus:ring-[#73b797]/50 focus:border-[#73b797]/50 text-[#e6edf3]'
          }`}
        >
          {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

/* ── Role card ────────────────────────────────────────────── */
function RoleCard({ id, name, label, description, selected, onChange }) {
  return (
    <label className={`flex-1 flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
      selected ? 'border-[#73b797]/50 bg-[#73b797]/8 ring-1 ring-[#73b797]/25' : 'border-white/10 bg-[#161b22] hover:border-white/20'
    }`}>
      <input type="radio" id={id} name={name} value={id} checked={selected} onChange={onChange} className="sr-only" />
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'bg-[#73b797]/20 text-[#73b797]' : 'bg-[#21262d] text-[#8b949e]'
      }`}>
        {selected ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <div>
        <div className="text-sm font-semibold text-white leading-tight">{label}</div>
        <div className="text-xs text-[#8b949e] mt-0.5 leading-tight">{description}</div>
      </div>
    </label>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit, validateStep1 } = useRegisterForm();

  const handleNext = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of researchers tracking trends in scientific publications"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      {globalError && <Alert variant="error" message={globalError} />}
      {successMsg && <Alert variant="success" message={successMsg} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Steps current={step} />

        {step === 1 && (
          <div className="space-y-4">
            <Field id="username" name="username" label="Username" placeholder="johndoe"
              value={formData.username} onChange={handleChange} icon={User}
              error={errors.username} autoComplete="username" autoFocus />
            <Field id="mail" name="mail" type="email" label="Email" placeholder="you@university.edu"
              value={formData.mail} onChange={handleChange} icon={Mail}
              error={errors.mail} autoComplete="email" />
            <Field id="password" name="password" label="Password" placeholder="Min 9 characters"
              value={formData.password} onChange={handleChange} icon={Lock}
              error={errors.password} autoComplete="new-password"
              helperText={errors.password ? undefined : '1 uppercase, 1 number, 1 special char'} />
            <Field id="confirmPassword" name="confirmPassword" label="Confirm Password" placeholder="Re-enter your password"
              value={formData.confirmPassword} onChange={handleChange} icon={Lock}
              error={errors.confirmPassword} autoComplete="new-password" />
            <button type="button" onClick={handleNext}
              className="w-full py-3 rounded-xl text-sm font-semibold text-[#0d1117] bg-[#73b797]
                hover:bg-[#8fcfb3] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#73b797]/15">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field id="phone" name="phone" type="tel" label="Phone Number" placeholder="0912 345 678"
              value={formData.phone} onChange={handleChange} icon={Phone}
              error={errors.phone} autoComplete="tel" />
            <Field id="dob" name="dob" type="date" label="Date of Birth"
              value={formData.dob} onChange={handleChange} icon={Calendar}
              error={errors.dob} />
            <Select id="gender" name="gender" label="Gender" value={formData.gender}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select gender', disabled: true },
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHERS', label: 'Others' },
              ]}
              error={errors.gender} />
            <Field id="workplace" name="workplace" label="Workplace / University"
              placeholder="FPT University" value={formData.workplace}
              onChange={handleChange} icon={Building2}
              error={errors.workplace} autoComplete="organization" />

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-2">I am a...</label>
              <div className="flex gap-3">
                <RoleCard id="STUDENT" name="role" label="Student / Lecturer"
                  description="Explore trends, bookmark papers"
                  selected={formData.role === 'STUDENT'} onChange={handleChange} />
                <RoleCard id="RESEARCHER" name="role" label="Researcher"
                  description="Deep analysis, topic reports"
                  selected={formData.role === 'RESEARCHER'} onChange={handleChange} />
              </div>
              {errors.role && <p className="text-xs text-red-400 mt-1.5">{errors.role}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#c9d1d9] bg-[#21262d]
                  hover:bg-[#30363d] border border-white/10 transition-all duration-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-[2] py-3 rounded-xl text-sm font-semibold text-[#0d1117] bg-[#73b797]
                  hover:bg-[#8fcfb3] disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#73b797]/15">
                {isLoading ? <LoadingSpinner label="Creating..." /> : 'Create account'}
              </button>
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
