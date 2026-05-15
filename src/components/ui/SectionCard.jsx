export default function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-[#0d1117]/60 border border-white/[0.06] rounded-xl ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
