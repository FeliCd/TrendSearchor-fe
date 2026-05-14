import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mb-8"
    >
      <div className="relative flex items-center bg-[#161b22] border border-white/10
        hover:border-[#4A90E2]/50 focus-within:border-[#4A90E2]/50 rounded-xl
        overflow-hidden transition-colors shadow-2xl shadow-black/20">
        <Search className="absolute left-4 w-5 h-5 text-[#8b949e] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, author, or journal..."
          className="flex-1 bg-transparent pl-12 pr-4 py-4 text-[#e6edf3] placeholder-[#8b949e]
            text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="m-1.5 px-5 py-2.5 bg-[#4A90E2] hover:bg-[#3A7BD5] text-white font-semibold
            text-sm rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
