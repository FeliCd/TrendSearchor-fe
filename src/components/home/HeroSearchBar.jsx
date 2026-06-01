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
      <div className="relative flex items-center bg-white border border-[#c6c6cd]/60
        hover:border-[#0058be]/50 focus-within:border-[#0058be]/50 rounded-xl
        overflow-hidden transition-all shadow-lg shadow-[#0b1c30]/5">
        <Search className="absolute left-4 w-5 h-5 text-[#76777d] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, author, or journal..."
          className="flex-1 bg-transparent pl-12 pr-4 py-4 text-[#0b1c30] placeholder-[#76777d]
            text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="m-1.5 px-5 py-2.5 bg-[#0058be] hover:bg-[#004395] text-white font-semibold
            text-sm rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm shadow-[#0058be]/20"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
