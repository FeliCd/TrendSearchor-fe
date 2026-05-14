import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const { formData, error, success, isLoading, handleChange, handleSubmit } =
    useForgotPasswordForm();

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email or username and we'll send you a link to reset your password"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      {error && <Alert variant="error" message={error} />}

      {success ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">Check your inbox</h3>
            <p className="text-sm text-[#8b949e]">
              We&apos;ve sent a password reset link to your email address. Please check your inbox and spam folder.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
              text-sm font-semibold text-[#0d1117] bg-white hover:bg-[#f0f6fc] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormInput
            id="emailOrUsername"
            name="emailOrUsername"
            label="Email or Username"
            placeholder="you@example.com"
            value={formData.emailOrUsername}
            onChange={handleChange}
            helperText="Enter the email or username associated with your account."
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#0d1117] bg-white
              hover:bg-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <LoadingSpinner label="Sending reset link..." />
            ) : (
              <>
                Send reset link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
