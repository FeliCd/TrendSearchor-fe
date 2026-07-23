export default function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-[#151515] border-2 border-gray-800 p-6 flex flex-col ${className}`}>
      {title && (
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">{title}</h2>
      )}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
