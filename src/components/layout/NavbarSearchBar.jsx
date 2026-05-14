import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavbarSearchBar({ scrolled }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`hidden sm:flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        scrolled
          ? 'w-80 md:w-96 lg:w-[420px] opacity-100 mx-2'
          : 'w-0 opacity-0 mx-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center w-80 md:w-96 lg:w-[420px] h-10 shrink-0 bg-[#161b22]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 focus-within:border-[#4A90E2]/60 focus-within:bg-[#1c2128] rounded-xl transition-colors duration-300 shadow-inner">
        <Search className="w-4 h-4 text-[#8b949e] ml-3 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers, keywords, authors..."
          className="flex-1 bg-transparent px-3 text-sm text-[#e6edf3] placeholder-[#8b949e]/80 focus:outline-none min-w-0"
        />
        <div className="flex items-center pr-1.5 shrink-0 gap-1.5">
          <button
            type="submit"
            className="p-1.5 text-[#8b949e] hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            title="Search"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
