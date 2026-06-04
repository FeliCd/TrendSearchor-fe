import { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const MIN_YEAR = 2010;
const MAX_YEAR = new Date().getFullYear();
const PRESETS = [
  { label: 'All Time', years: null },
  { label: 'Last 5 Years', years: 5 },
  { label: 'Last 3 Years', years: 3 },
  { label: 'Last Year', years: 1 },
];

export default function YearRangeFilter({ startYear, endYear, onChange }) {
  const [open, setOpen] = useState(false);

  const handlePreset = (preset) => {
    if (preset.years === null) {
      onChange(MIN_YEAR, MAX_YEAR);
    } else {
      const start = MAX_YEAR - preset.years + 1;
      onChange(start, MAX_YEAR);
    }
    setOpen(false);
  };

  const displayLabel = () => {
    if (!startYear && !endYear) return 'All Time';
    if (startYear === MIN_YEAR && endYear === MAX_YEAR) return 'All Time';
    if (startYear && endYear) return `${startYear} – ${endYear}`;
    if (startYear) return `${startYear} – ${MAX_YEAR}`;
    if (endYear) return `${MIN_YEAR} – ${endYear}`;
    return 'All Time';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center h-10 gap-2 px-4 bg-[#151515] border-2 border-gray-800 rounded-none text-[11px] font-black uppercase tracking-widest text-gray-400 hover:border-gray-600 hover:text-white transition-all"
      >
        <Calendar className="w-3.5 h-3.5 text-gray-500" />
        <span>{displayLabel()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1.5 bg-[#1e1e1e] border-2 border-gray-800 rounded-none shadow-xl z-50 overflow-hidden min-w-[160px]">
            <div className="p-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white rounded-none transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-800 p-2">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5 px-1">Custom Range</p>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={startYear || ''}
                  onChange={(e) => onChange(parseInt(e.target.value) || null, endYear)}
                  placeholder={MIN_YEAR}
                  className="w-16 bg-[#151515] border-2 border-gray-800 rounded-none px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-[#0058be]/50"
                />
                <span className="text-gray-600 text-xs">–</span>
                <input
                  type="number"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={endYear || ''}
                  onChange={(e) => onChange(startYear, parseInt(e.target.value) || null)}
                  placeholder={MAX_YEAR}
                  className="w-16 bg-[#151515] border-2 border-gray-800 rounded-none px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-[#0058be]/50"
                />
              </div>
              {(startYear || endYear) && (
                <button
                  onClick={() => { onChange(null, null); setOpen(false); }}
                  className="w-full mt-1.5 flex items-center justify-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-red-400 rounded-none transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
