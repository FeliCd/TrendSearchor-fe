export default function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 shadow-sm rounded-2xl p-5">
      {Icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} mb-3`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      )}
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-[#8b949e]">{label}</p>
    </div>
  );
}
