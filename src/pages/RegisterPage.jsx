import { useState, useEffect, useRef } from 'react';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { User, Mail, Lock, Phone, Calendar, Building2 } from 'lucide-react';
import { Steps } from '@/components/auth/Steps';
import { AuthField } from '@/components/auth/AuthField';
import { AuthSelect } from '@/components/auth/AuthSelect';
import { RoleCard } from '@/components/auth/RoleCard';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit, validateStep1 } = useRegisterForm();
  const { toasts, addToast, removeToast } = useToast();
  const prevErrorsRef = useRef({});

  useEffect(() => {
    const prevErrors = prevErrorsRef.current;
    const newErrors = errors || {};
    Object.entries(newErrors).forEach(([key, msg]) => {
      if (msg && msg !== prevErrors[key]) {
        addToast(msg, 'error');
      }
    });
    prevErrorsRef.current = newErrors;
  }, [errors, addToast]);

  useEffect(() => {
    if (globalError) addToast(globalError, 'error');
  }, [globalError, addToast]);

  useEffect(() => {
    if (successMsg) addToast(successMsg, 'success');
  }, [successMsg, addToast]);

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
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Steps current={step} />

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthField id="fullName" name="fullName" label="Full Name" placeholder="John Doe"
                value={formData.fullName} onChange={handleChange} icon={User}
                error={errors.fullName} autoComplete="name" autoFocus />
              <AuthField id="mail" name="mail" type="email" label="Email" placeholder="you@university.edu"
                value={formData.mail} onChange={handleChange} icon={Mail}
                error={errors.mail} autoComplete="email" />
              <AuthField id="password" name="password" type="password" label="Password" placeholder="Min 9 characters"
                value={formData.password} onChange={handleChange} icon={Lock}
                error={errors.password} autoComplete="new-password"
                helperText={errors.password ? undefined : '1 uppercase, 1 number, 1 special char'} />
              <AuthField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter your password"
                value={formData.confirmPassword} onChange={handleChange} icon={Lock}
                error={errors.confirmPassword} autoComplete="new-password" />
            </div>
            <button type="button" onClick={handleNext}
              className="w-full py-3.5 bg-white text-black text-sm font-black uppercase tracking-widest
                hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>

            {/* Social Register */}
            <div className="mt-8 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#151515] text-xs font-bold uppercase tracking-widest text-gray-500">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-800 bg-[#1e1e1e] text-white font-bold uppercase tracking-widest text-xs
                    hover:border-gray-600 hover:bg-[#252525] transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </a>
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-800 bg-[#1e1e1e] text-white font-bold uppercase tracking-widest text-xs
                    hover:border-gray-600 hover:bg-[#252525] transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#A6CE39">
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
              <AuthField id="phone" name="phone" type="tel" label="Phone Number" placeholder="0912 345 678"
                value={formData.phone} onChange={handleChange} icon={Phone}
                error={errors.phone} autoComplete="tel" />
              <AuthField id="dob" name="dob" type="date" label="Date of Birth"
                value={formData.dob} onChange={handleChange} icon={Calendar}
                error={errors.dob} />
              <AuthSelect id="gender" name="gender" label="Gender" value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select gender', disabled: true },
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHERS', label: 'Others' },
                ]}
                error={errors.gender} />
              <AuthField id="workplace" name="workplace" label="Workplace / University"
                placeholder="FPT University" value={formData.workplace}
                onChange={handleChange} icon={Building2}
                error={errors.workplace} autoComplete="organization" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">I am a...</label>
              <div className="flex gap-3">
                <RoleCard id="STUDENT" name="role" label="Student / Lecturer"
                  description="Explore trends, bookmark papers"
                  selected={formData.role === 'STUDENT'} onChange={handleChange} />
                <RoleCard id="RESEARCHER" name="role" label="Researcher"
                  description="Deep analysis, topic reports"
                  selected={formData.role === 'RESEARCHER'} onChange={handleChange} />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setStep(1)}
                className="w-1/3 py-3.5 border-2 border-gray-800 text-white font-bold uppercase tracking-widest text-xs
                  hover:bg-[#1e1e1e] transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back
              </button>
              <button type="submit" disabled={isLoading}
                className="w-2/3 py-3.5 bg-white text-black font-black uppercase tracking-widest text-xs
                  hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {isLoading ? <LoadingSpinner label="Creating..." /> : 'Create account'}
              </button>
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
