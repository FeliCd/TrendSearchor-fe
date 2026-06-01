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
        <label htmlFor={id} className="text-sm font-semibold text-[#0b1c30] mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Lock className={`w-4 h-4 ${error ? 'text-red-400' : 'text-[#76777d]'}`} />
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
          className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-[#0b1c30]
            text-sm placeholder:text-[#76777d] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                : 'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be]'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#76777d] hover:text-[#0b1c30] transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#76777d] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
