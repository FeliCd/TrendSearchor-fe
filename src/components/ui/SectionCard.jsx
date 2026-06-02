export default function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-[#1e1e1e] border border-gray-800 rounded-2xl ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
