export default function FormInput({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  helperText,
  required = true,
  autoComplete,
  autoFocus,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#c9d1d9]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {typeof Icon === 'function' ? <Icon /> : <Icon className={`w-4 h-4 ${error ? 'text-red-400/60' : 'text-[#8b949e]'}`} />}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete || name}
          required={required}
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 bg-[#161b22] border rounded-lg text-[#c9d1d9]
            text-sm placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                : 'border-white/10 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50'
            }`}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#8b949e] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
