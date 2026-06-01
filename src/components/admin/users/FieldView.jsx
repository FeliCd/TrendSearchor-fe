export default function FieldView({ value }) {
  return (
    <div className="px-3 py-2.5 rounded-xl text-sm text-[#0b1c30] bg-white border border-[#c6c6cd]/60 flex items-center gap-2 shadow-sm">
      <span className="text-[#0b1c30]">{value}</span>
    </div>
  );
}
