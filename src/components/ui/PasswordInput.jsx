import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  id = 'password',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  placeholder = '••••••••',
  helperText,
  required = true,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#c9d1d9]">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Lock className={`w-4 h-4 ${error ? 'text-red-400/60' : 'text-[#8b949e]'}`} />
        </div>
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 bg-[#161b22] border rounded-lg text-[#c9d1d9]
            text-sm placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                : 'border-white/10 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#8b949e] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
