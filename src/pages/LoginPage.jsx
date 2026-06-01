import { Link } from 'react-router-dom';
import { useLoginForm } from '@/hooks/useLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const {
    formData,
    errors,
    globalError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your research dashboard."
      footerText="Don't have an account?"
      footerLinkText="Create Account"
      footerLinkTo="/register"
    >
      {globalError && <Alert variant="error" message={globalError} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Academic Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#0b1c30] mb-1.5">
            Academic Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-[18px] h-[18px] text-[#76777d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              required
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0b1c30]
                placeholder:text-[#76777d] focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                    : 'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be]'
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-[#0b1c30]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#0058be] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-[18px] h-[18px] text-[#76777d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0b1c30]
                placeholder:text-[#76777d] focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                    : 'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be]'
                }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white
              bg-[#0058be] hover:bg-[#004395] disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-sm shadow-[#0058be]/20"
          >
            {isLoading ? (
              <LoadingSpinner label="Signing in..." />
            ) : (
              <>
                Sign In
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c6c6cd]/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-xs font-medium text-[#76777d]">
              Or sign in with
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
    </AuthLayout>
  );
}
