export default function InputField({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  required = true,
  placeholder,
  icon: Icon,
  error,
  helperText,
  focusRingClass = "focus:ring-primary-500/50 focus:border-primary-500",
  extraContent
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-[#c9d1d9]">
          {label}
        </label>
        {extraContent && <div className="text-sm">{extraContent}</div>}
      </div>
      <div className="mt-2 relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-[#8b949e]" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={name}
          required={required}
          value={value}
          onChange={onChange}
          className={`block w-full ${Icon ? 'pl-10' : 'px-3'} bg-[#0d1117] border border-[#30363d] rounded-lg py-2.5 text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 ${focusRingClass} transition-colors sm:text-sm ${type === 'date' ? '[color-scheme:dark]' : ''}`}
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#8b949e]">{helperText}</p>
      ) : null}
    </div>
  );
}
