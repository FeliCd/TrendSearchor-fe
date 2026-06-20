import { Check } from 'lucide-react';

export function Steps({ current }) {
  const steps = ['Account', 'Details'];
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const isDone = num < current;
        const isActive = num === current;
        return (
          <div key={num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
              isDone ? 'bg-white text-black border border-white' :
              isActive ? 'bg-[#0058be] text-white' :
              'bg-[#1e1e1e] text-gray-500 border border-gray-800'
            }`}>
              {isDone ? (
                <Check className="w-3 h-3" strokeWidth={3} />
              ) : num}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : isDone ? 'text-gray-300' : 'text-gray-600'}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${isDone ? 'bg-white/30' : 'bg-gray-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
