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
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const isDone = num < current;
        const isActive = num === current;
        return (
          <div key={num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
              isDone ? 'bg-[#e5eeff] text-[#0058be] border border-[#dce9ff]' :
              isActive ? 'bg-[#0058be] text-white shadow-sm shadow-[#0058be]/20' :
              'bg-[#f8f9ff] text-[#76777d] border border-[#c6c6cd]'
            }`}>
              {isDone ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : num}
            </div>
            <span className={`text-sm font-medium ${isActive ? 'text-[#0b1c30]' : isDone ? 'text-[#0058be]' : 'text-[#76777d]'}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${isDone ? 'bg-[#0058be]/40' : 'bg-[#c6c6cd]'}`} />
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
      <label htmlFor={id} className="block text-sm font-semibold text-[#0b1c30] mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`w-[18px] h-[18px] ${error ? 'text-red-500' : 'text-[#76777d]'}`} />
          </div>
        )}
        <input
          id={id} name={name} type={inputType}
          placeholder={placeholder} value={value} onChange={onChange}
          autoComplete={autoComplete || name} autoFocus={autoFocus}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 bg-white border rounded-xl text-sm text-[#0b1c30]
            placeholder:text-[#76777d] focus:outline-none focus:ring-2 transition-all ${
              error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50' :
              'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be]'
            }`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#0b1c30] transition-colors">
            {show ? (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-[#76777d]'}`}>{error || helperText}</p>
      )}
    </div>
  );
}

/* ── Select ───────────────────────────────────────────────── */
function Select({ id, name, label, value, onChange, options, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#0b1c30] mb-1.5">{label}</label>
      <div className="relative">
        <select id={id} name={name} value={value} onChange={onChange}
          className={`w-full pl-4 pr-10 py-2.5 bg-white border rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all ${
            error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50 text-red-500' :
            'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be] text-[#0b1c30]'
          }`}
        >
          {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
        </select>
        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ── Role card ────────────────────────────────────────────── */
function RoleCard({ id, name, label, description, selected, onChange }) {
  return (
    <label className={`flex-1 flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
      selected ? 'border-[#0058be] bg-[#eff4ff] ring-1 ring-[#0058be]/25' : 'border-[#c6c6cd] bg-white hover:border-[#0058be]/40'
    }`}>
      <input type="radio" id={id} name={name} value={id} checked={selected} onChange={onChange} className="sr-only" />
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'bg-[#0058be] text-white' : 'bg-[#f8f9ff] border border-[#c6c6cd] text-[#76777d]'
      }`}>
        {selected ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : <div className="w-2 h-2 rounded-full bg-[#c6c6cd]" />}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0b1c30] leading-tight">{label}</div>
        <div className="text-xs text-[#76777d] mt-0.5 leading-tight">{description}</div>
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
      isWide={true}
    >
      {globalError && <Alert variant="error" message={globalError} />}
      {successMsg && <Alert variant="success" message={successMsg} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Steps current={step} />

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="fullName" name="fullName" label="Full Name" placeholder="John Doe"
                value={formData.fullName} onChange={handleChange} icon={User}
                error={errors.fullName} autoComplete="name" autoFocus />
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
            </div>
            <button type="button" onClick={handleNext}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0058be]
                hover:bg-[#004395] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-[#0058be]/20">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>

            {/* Social Register */}
            <div className="mt-6 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#c6c6cd]/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-xs font-medium text-[#76777d]">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-[#c6c6cd] rounded-xl
                    bg-white text-sm font-medium text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </a>
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-[#c6c6cd] rounded-xl
                    bg-white text-sm font-medium text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#A6CE39">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-4.75 16.7h-2.1V7.3h2.1v9.4zm-1.05-10.74c-.7 0-1.25-.55-1.25-1.25s.55-1.25 1.25-1.25 1.25.55 1.25 1.25-.55 1.25-1.25 1.25zm9.8 10.74h-2.1v-4.8c0-1.15-.4-1.9-1.42-1.9-.78 0-1.25.52-1.45 1.02-.07.18-.1.43-.1.68v5h-2.1s.03-8.52 0-9.4h2.1v1.33c.28-.43.78-1.05 1.92-1.05 1.4 0 2.45.92 2.45 2.9v6.22z"/>
                  </svg>
                  ORCID
                </a>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0b1c30] mb-2">I am a...</label>
              <div className="flex gap-3">
                <RoleCard id="STUDENT" name="role" label="Student / Lecturer"
                  description="Explore trends, bookmark papers"
                  selected={formData.role === 'STUDENT'} onChange={handleChange} />
                <RoleCard id="RESEARCHER" name="role" label="Researcher"
                  description="Deep analysis, topic reports"
                  selected={formData.role === 'RESEARCHER'} onChange={handleChange} />
              </div>
              {errors.role && <p className="text-xs text-red-500 mt-1.5">{errors.role}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#45464d] bg-white
                  hover:bg-[#f8f9ff] border border-[#c6c6cd] transition-all duration-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0058be]
                  hover:bg-[#004395] disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-[#0058be]/20">
                {isLoading ? <LoadingSpinner label="Creating..." /> : 'Create account'}
              </button>
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
