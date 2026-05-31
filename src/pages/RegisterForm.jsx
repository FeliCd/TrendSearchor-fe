import { ChevronDown } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const UserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GenderIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ShieldIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const WorkplaceIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;

function SelectField({ id, name, label, value, onChange, icon, options, error }) {
  const IconEl = icon;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#c9d1d9]">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <IconEl />
        </div>
        <select id={id} name={name} value={value} onChange={onChange}
          className={`w-full pl-10 pr-10 py-2.5 bg-[#161b22] border rounded-lg text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
            error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50' : 'border-white/10 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50'
          }`}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none"><ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" /></div>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterForm({ formData, errors, isLoading, handleChange, handleSubmit }) {
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput id="username" name="username" label="Username" placeholder="johndoe" value={formData.username} onChange={handleChange} icon={UserIcon} error={errors.username} />
        <FormInput id="mail" name="mail" type="email" label="Email address" placeholder="you@example.com" value={formData.mail} onChange={handleChange} icon={MailIcon} error={errors.mail} />
        <PasswordInput id="password" name="password" label="Password" value={formData.password} onChange={handleChange} error={errors.password} autoComplete="new-password" helperText={errors.password ? undefined : 'Min 9 chars: 1 uppercase, 1 number, 1 special char.'} />
        <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" placeholder="••••••••" helperText={errors.confirmPassword ? undefined : 'Re-enter your password'} />
        <FormInput id="phone" name="phone" type="tel" label="Phone Number" placeholder="0912345678" value={formData.phone} onChange={handleChange} icon={PhoneIcon} error={errors.phone} />
        <FormInput id="dob" name="dob" type="date" label="Date of Birth" value={formData.dob} onChange={handleChange} icon={CalendarIcon} error={errors.dob} />
        <SelectField id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} icon={GenderIcon}
          options={[{ value: '', label: 'Select gender', disabled: true }, { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHERS', label: 'Others' }]}
          error={errors.gender} />
        <SelectField id="role" name="role" label="Account Type" value={formData.role} onChange={handleChange} icon={ShieldIcon}
          options={[{ value: '', label: 'Select account type', disabled: true }, { value: 'STUDENT', label: 'Student / Lecturer' }, { value: 'RESEARCHER', label: 'Researcher' }]}
          error={errors.role} />
        <div className="sm:col-span-2">
          <FormInput id="workplace" name="workplace" label="Workplace / University" placeholder="FPT University" value={formData.workplace} onChange={handleChange} icon={WorkplaceIcon} error={errors.workplace} />
        </div>
      </div>
      <button type="submit" disabled={isLoading}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#0d1117] bg-white hover:bg-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2">
        {isLoading ? <LoadingSpinner label="Creating account..." /> : 'Create account'}
      </button>
    </form>
  );
}
