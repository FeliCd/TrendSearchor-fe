export default function TextInput({ type = 'text', value, onChange, error, placeholder }) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full pl-3 pr-3 py-2.5 rounded-xl text-sm text-white bg-[var(--dark-bg-base)] border placeholder:text-gray-500 focus:outline-none transition-all duration-200 ${
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
            : 'border-gray-800 focus:border-[#0058be]/50 focus:ring-2 focus:ring-[#0058be]/10'
        }`} />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
