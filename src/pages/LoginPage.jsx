import { Lock, User } from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import InputField from '@/components/auth/InputField';

export default function LoginPage() {
  const { formData, error, isLoading, handleChange, handleSubmit } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
      icon={<Lock className="h-6 w-6 text-primary-500" />}
      footerText="Don't have an account?"
      footerLinkText="Sign up now"
      footerLinkTo="/register"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="username"
          name="username"
          label="Username"
          placeholder="admin"
          value={formData.username}
          onChange={handleChange}
          icon={User}
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          extraContent={
            <a href="#" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Forgot password?
            </a>
          }
        />

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

