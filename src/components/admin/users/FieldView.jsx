export default function FieldView({ value }) {
  return (
    <div className="px-3 py-2.5 border-2 text-sm text-white bg-[#1e1e1e] border-gray-800 flex items-center gap-2">
      <span>{value}</span>
    </div>
  );
}
