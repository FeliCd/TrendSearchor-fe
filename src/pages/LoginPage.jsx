import { Link } from 'react-router-dom';
import { useLoginForm } from '@/hooks/useLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const { formData, errors, globalError, isLoading, handleChange, handleSubmit } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue exploring research trends"
      footerText="Don't have an account?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    >
      {globalError && <Alert variant="error" message={globalError} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          id="username" name="username" label="Username or Email"
          placeholder="admin" value={formData.username} onChange={handleChange}
          autoFocus autoComplete="username" error={errors.username}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#c9d1d9]">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#73b797] hover:text-[#8fcfb3] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              id="password" name="password" type="password"
              placeholder="Enter your password" value={formData.password}
              onChange={handleChange} autoComplete="current-password" required
              className={`w-full pl-10 pr-4 py-2.5 bg-[#161b22] border rounded-lg text-sm text-[#e6edf3]
                placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                    : 'border-white/10 focus:ring-[#73b797]/50 focus:border-[#73b797]/50'
                }`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-[#0d1117] bg-[#73b797]
            hover:bg-[#8fcfb3] disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#73b797]/15">
          {isLoading ? <LoadingSpinner label="Signing in..." /> : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
