export default function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="group relative overflow-hidden px-5 py-4 border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 bg-[#1e1e1e]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{label}</p>
          <p className="text-3xl font-bold text-white leading-none tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="mt-0.5 w-9 h-9 border-2 bg-[#151515] border-gray-800 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        )}
      </div>
    </div>
  );
}
