import { User, Mail, Lock, Phone, Calendar, Briefcase } from 'lucide-react';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import InputField from '@/components/auth/InputField';
import SelectField from '@/components/auth/SelectField';

export default function RegisterPage() {
  const { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit } = useRegisterForm();

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join us and start discovering trends"
      icon={<User className="h-6 w-6 text-accent-500" />}
      iconColorClass="text-accent-500"
      iconBgClass="bg-accent-500/10"
      iconBorderClass="border-accent-500/20"
      shadowClass="shadow-accent-500/5"
      linkHoverClass="text-accent-400 hover:text-accent-300"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      {globalError && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {globalError}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
          {successMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="username"
            name="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            icon={User}
            error={errors.username}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
          />

          <InputField
            id="mail"
            name="mail"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={formData.mail}
            onChange={handleChange}
            icon={Mail}
            error={errors.mail}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
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
            error={errors.password}
            helperText="≥ 9 chars, 1 uppercase, 1 number, 1 special char."
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
          />

          <InputField
            id="phone"
            name="phone"
            label="Phone Number"
            placeholder="0912345678"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
            error={errors.phone}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
          />

          <InputField
            id="dob"
            name="dob"
            type="date"
            label="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            icon={Calendar}
            error={errors.dob}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
          />

          <SelectField
            id="gender"
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHERS', label: 'Others' }
            ]}
          />


          <InputField
            id="workplace"
            name="workplace"
            label="Workplace / University"
            placeholder="FPT University"
            value={formData.workplace}
            onChange={handleChange}
            icon={Briefcase}
            error={errors.workplace}
            focusRingClass="focus:ring-accent-500/50 focus:border-accent-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] focus:ring-accent-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}


