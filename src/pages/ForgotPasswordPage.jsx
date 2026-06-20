import { Link } from 'react-router-dom';
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm';
import AuthLayout from '@/components/auth/AuthLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const { formData, error, success, isLoading, handleChange, handleSubmit } =
    useForgotPasswordForm();

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we will send you a new password."
      footerText="Remember back?"
      footerLinkText="Login here"
      footerLinkTo="/login"
    >
      {error && <Alert variant="error" message={error} />}

      {success ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#1e1e1e] border-2 border-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Check your inbox</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              We have sent a new password to your email address. Please check your inbox and spam folder.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-black uppercase tracking-widest text-sm
              hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            Back to Sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mail" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                id="mail"
                name="mail"
                type="email"
                placeholder="you@university.edu"
                value={formData.mail}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-[#1e1e1e] border-2 border-gray-800 text-white font-medium text-sm
                  placeholder:text-gray-600 focus:outline-none focus:border-[#0058be] transition-all"
              />
            </div>
            <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed">
              Enter the email address associated with your account.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-black uppercase tracking-widest text-sm
              hover:bg-gray-200 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <LoadingSpinner label="Sending..." />
            ) : (
              <>
                Send Reset Password
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
