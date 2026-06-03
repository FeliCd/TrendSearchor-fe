import { Search, Loader2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';

export default function SearchHeader({ query, setQuery, filters, setFilters, loading, onSearch, error }) {
  return (
    <div className="w-full">
      <form onSubmit={onSearch} className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1 w-full min-w-[200px]">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, title, author, or topic..."
            className="w-full pl-10 pr-4 h-11 rounded-none text-sm text-white bg-[#1e1e1e] border-2 border-gray-800
              placeholder:text-gray-400 focus:outline-none focus:border-[#0058be] focus:ring-0
              transition-all shadow-none" 
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Filter */}
          <input 
            type="date" 
            value={filters.dateFrom} 
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            placeholder="From Date" 
            style={{ colorScheme: 'dark' }}
            className="w-[150px] px-3 h-11 rounded-none text-sm text-white bg-[#1e1e1e] border-2 border-gray-800
              placeholder:text-gray-400 focus:outline-none focus:border-[#0058be] focus:ring-0
              transition-all shadow-none" 
          />
          <span className="text-gray-500 font-bold">-</span>
          <input 
            type="date" 
            value={filters.dateTo} 
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            placeholder="To Date" 
            style={{ colorScheme: 'dark' }}
            className="w-[150px] px-3 h-11 rounded-none text-sm text-white bg-[#1e1e1e] border-2 border-gray-800
              placeholder:text-gray-400 focus:outline-none focus:border-[#0058be] focus:ring-0
              transition-all shadow-none" 
          />
          
          {/* Sort By Filter */}
          <select 
            value={filters.sortBy} 
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
            className="px-3 h-11 rounded-none text-sm text-gray-300 bg-[#1e1e1e] border-2 border-gray-800
              focus:outline-none focus:border-[#0058be] focus:ring-0
              transition-all shadow-none cursor-pointer min-w-[140px]"
          >
            <option value="relevance">Relevance</option>
            <option value="citationCount">Citations</option>
            <option value="year">Year</option>
          </select>

          {/* Search Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 h-11 bg-white text-black font-black uppercase tracking-widest rounded-none border-2 border-transparent
              hover:bg-gray-200 transition-all disabled:opacity-50 text-[11px] shadow-none"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>
      </form>
      {error && <div className="mt-4"><Alert type="error" message={error} /></div>}
    </div>
  );
}
