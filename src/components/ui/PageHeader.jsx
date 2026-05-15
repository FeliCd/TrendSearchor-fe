import { Plus } from 'lucide-react';

export default function PageHeader({ title, description, action, actionLabel, onAction }) {
  return (
    <div className="border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-sm text-[#8b949e] mt-0.5">{description}</p>
            )}
          </div>
          {action && (
            <button
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                bg-[#4A90E2] hover:bg-[#357ABD] text-white transition-all duration-200
                shadow-lg shadow-[#4A90E2]/20 border border-[#4A90E2]/50
                hover:shadow-[#4A90E2]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {action}
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
