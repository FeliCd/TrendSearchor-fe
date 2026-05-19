export default function FieldView({ value }) {
  return (
    <div className="px-3 py-2.5 rounded-xl text-sm text-white bg-[#161b22]/60 border border-white/[0.06] flex items-center gap-2">
      <span className="text-[#8b949e]">{value}</span>
    </div>
  );
}
