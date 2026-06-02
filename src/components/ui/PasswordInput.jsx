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
  placeholder = '',
  helperText,
  required = true,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Lock className={`w-4 h-4 ${error ? 'text-red-400' : 'text-gray-500'}`} />
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
          className={`w-full pl-10 pr-10 py-3 border-2 text-white font-medium text-sm
            placeholder:text-gray-600 focus:outline-none transition-all bg-[#1e1e1e] ${
              error
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-gray-800 focus:border-[#0058be]'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
