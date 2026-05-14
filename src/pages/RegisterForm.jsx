import { ChevronDown } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RegisterForm({ formData, errors, isLoading, handleChange, handleSubmit }) {

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <FormInput
          id="username"
          name="username"
          label="Username"
          placeholder="johndoe"
          value={formData.username}
          icon={() => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          error={errors.username}
        />

        <FormInput
          id="mail"
          name="mail"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.mail}
          icon={() => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          error={errors.mail}
        />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          helperText={errors.password ? undefined : 'Min 9 chars: 1 uppercase, 1 number, 1 special char.'}
        />

        <FormInput
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="0912345678"
          value={formData.phone}
          icon={() => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          )}
          error={errors.phone}
        />

        <FormInput
          id="dob"
          name="dob"
          type="date"
          label="Date of Birth"
          value={formData.dob}
          icon={() => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          error={errors.dob}
        />

        {/* Gender select */}
        <div className="space-y-1.5">
          <label htmlFor="gender" className="text-sm font-medium text-[#c9d1d9]">Gender</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className={`w-4 h-4 ${errors.gender ? 'text-red-400/60' : 'text-[#8b949e]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 bg-[#161b22] border rounded-lg text-[#c9d1d9] text-sm
                placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                  errors.gender
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                    : 'border-white/10 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50'
                }`}
            >
              <option value="" disabled className="text-[#484f58]">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHERS">Others</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8b949e]">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender}</p>}
        </div>

        <div className="sm:col-span-2">
          <FormInput
            id="workplace"
            name="workplace"
            label="Workplace / University"
            placeholder="FPT University"
            value={formData.workplace}
            icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
            error={errors.workplace}
          />
        </div>

      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#0d1117] bg-white
          hover:bg-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
          flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? <LoadingSpinner label="Creating account..." /> : 'Create account'}
      </button>
    </form>
  );
}
