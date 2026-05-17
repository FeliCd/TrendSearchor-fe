import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const { formData, errors, globalError, isLoading, rememberMe, handleChange, handleSubmit } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your dashboard and continue exploring research trends"
      footerText="Don't have an account?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    >
      {globalError && <Alert variant="error" message={globalError} />}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          name="username"
          label="Username or Email"
          placeholder="admin"
          value={formData.username}
          onChange={handleChange}
          icon={User}
          autoFocus
          autoComplete="username"
          error={errors.username}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#c9d1d9]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#4A90E2] hover:text-[#6ba3e0] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            error={errors.password}
          />
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/20 bg-[#161b22] text-[#4A90E2]
              focus:ring-2 focus:ring-[#4A90E2]/50 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-[#8b949e] cursor-pointer select-none">
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#0d1117] bg-white
            hover:bg-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            flex items-center justify-center gap-2 mt-1"
        >
          {isLoading ? (
            <LoadingSpinner label="Signing in..." />
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
