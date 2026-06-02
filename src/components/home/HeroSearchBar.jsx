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
      <div className="relative flex items-center bg-white border-2 border-transparent
        hover:border-[#5b58ff] focus-within:border-[#5b58ff] rounded-none
        transition-all hover:shadow-[6px_6px_0px_0px_#5b58ff] focus-within:shadow-[6px_6px_0px_0px_#5b58ff]">
        <Search className="absolute left-4 w-5 h-5 text-[#76777d] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, author, or journal..."
          className="flex-1 bg-transparent pl-12 pr-4 py-4 text-black placeholder-gray-400
            text-sm font-bold focus:outline-none rounded-none"
        />
        <button
          type="submit"
          className="m-1.5 px-6 py-3 bg-black hover:bg-[#5b58ff] text-white font-black uppercase tracking-widest
            text-[11px] rounded-none transition-colors flex items-center gap-2 shrink-0 border-2 border-transparent"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
