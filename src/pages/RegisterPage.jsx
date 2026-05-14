import { useRegisterForm } from '@/hooks/useRegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import Alert from '@/components/ui/Alert';
import RegisterForm from '@/pages/RegisterForm';

export default function RegisterPage() {
  const { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit } =
    useRegisterForm();

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
      <RegisterForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </AuthLayout>
  );
}
