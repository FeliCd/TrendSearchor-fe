export default function FormField({ label, icon, required, children }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#76777d] mb-2 uppercase tracking-widest">
        {icon}{label}{required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
