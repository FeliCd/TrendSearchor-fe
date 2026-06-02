export default function FieldView({ value }) {
  return (
    <div className="px-3 py-2.5 rounded-xl text-sm text-white bg-[var(--dark-bg-base)] border border-gray-800 flex items-center gap-2">
      <span>{value}</span>
    </div>
  );
}
