export function RoleCard({ id, name, label, description, selected, onChange }) {
  return (
    <label className={`flex-1 flex items-center gap-3 p-3.5 border-2 cursor-pointer transition-all duration-200 ${
      selected ? 'border-white bg-white text-black' : 'border-gray-800 bg-[#1e1e1e] hover:border-gray-600 text-white'
    }`}>
      <input type="radio" id={id} name={name} value={id} checked={selected} onChange={onChange} className="sr-only" />
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'bg-[#0058be] text-white' : 'bg-transparent border border-gray-600'
      }`}>
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        )}
      </div>
      <div>
        <div className={`text-xs font-black uppercase tracking-widest leading-tight ${selected ? 'text-black' : 'text-white'}`}>{label}</div>
        <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 leading-tight ${selected ? 'text-gray-600' : 'text-gray-500'}`}>{description}</div>
      </div>
    </label>
  );
}
