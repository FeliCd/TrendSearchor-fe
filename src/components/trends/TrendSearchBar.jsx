import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function TrendSearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search for a keyword (e.g., LLM, computer vision)...',
  loading = false,
  suggestions = [],
  onSuggestionClick,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value.trim());
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleClear = () => {
    onClear?.();
    onChange('');
    setIsOpen(false);
  };

  const handleSuggestionClick = (s) => {
    onSuggestionClick?.(s);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = isOpen && suggestions && suggestions.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#0058be]/30 border-t-[#0058be] rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-10 bg-[#151515] border-2 border-gray-800 rounded-none text-sm font-medium text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0058be] transition-colors"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-none text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1e1e1e] border-2 border-gray-800 rounded-none shadow-xl overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#0058be] hover:text-white transition-colors"
            >
              <span className="font-medium">{s.displayName || s.keyword || s}</span>
              {s.paperCount != null && (
                <span className="ml-2 text-xs text-gray-500">
                  {Number(s.paperCount).toLocaleString()} papers
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
