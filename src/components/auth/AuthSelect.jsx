export function AuthSelect({ id, name, label, value, onChange, options, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <select id={id} name={name} value={value} onChange={onChange}
          className="w-full pl-4 pr-11 py-3 bg-[#1e1e1e] border-2 text-sm font-medium appearance-none cursor-pointer focus:outline-none transition-all
            border-gray-800 focus:border-[#0058be] text-white"
        >
          {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled} className="bg-[#151515] text-white">{o.label}</option>)}
        </select>
        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
}
