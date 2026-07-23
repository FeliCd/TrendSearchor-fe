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
        <label htmlFor={id} className="text-sm font-semibold text-[#0b1c30] mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {typeof Icon === 'function' ? <Icon /> : <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-[#76777d]'}`} />}
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
          className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-[#0b1c30]
            text-sm placeholder:text-[#76777d] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                : 'border-[#c6c6cd] focus:ring-[#0058be]/40 focus:border-[#0058be]'
            }`}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#76777d] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
