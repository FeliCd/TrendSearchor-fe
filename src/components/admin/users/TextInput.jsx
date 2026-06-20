export default function TextInput({ type = 'text', value, onChange, error, placeholder }) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full pl-3 pr-3 py-2.5 border-2 text-sm text-white bg-[#1e1e1e] placeholder:text-gray-500 focus:outline-none transition-all duration-200 ${
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-0'
            : 'border-gray-800 focus:border-[#0058be] focus:ring-0'
        }`} />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
