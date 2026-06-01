import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectDropdown({ value, onChange, options, className = '', placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm bg-white border transition-all shadow-sm ${
          isOpen ? 'border-[#0058be]/50 ring-2 ring-[#0058be]/10' : 'border-[#c6c6cd]/60 hover:bg-[#f8f9ff]'
        }`}
      >
        <span className={selectedOption ? 'text-[#0b1c30]' : 'text-[#76777d] truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 text-[#76777d] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full min-w-[140px] mt-1.5 bg-white border border-[#c6c6cd]/60 rounded-xl shadow-xl shadow-black/5 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors ${
                    value === option.value ? 'bg-[#0058be]/5 text-[#0058be] font-semibold' : 'text-[#0b1c30] hover:bg-[#f8f9ff]'
                  }`}
                >
                  <span className="truncate text-left flex-1 pr-2">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
