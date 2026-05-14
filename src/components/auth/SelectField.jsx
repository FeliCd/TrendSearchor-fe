export default function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  icon: Icon,
  error,
  focusRingClass = "focus:ring-primary-500/50 focus:border-primary-500"
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#c9d1d9]">
        {label}
      </label>
      <div className="mt-2 relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-[#8b949e]" />
          </div>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`block w-full ${Icon ? 'pl-10 pr-3' : 'px-3'} bg-[#0d1117] border border-[#30363d] rounded-lg py-2.5 text-[#e6edf3] focus:outline-none focus:ring-2 ${focusRingClass} transition-colors sm:text-sm`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
