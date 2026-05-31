import { Search, Loader2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';

export default function SearchHeader({ query, setQuery, filters, setFilters, loading, onSearch, error }) {
  return (
    <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-[#010409] border-b border-white/5">
      <h1 className="text-2xl font-bold text-white mb-1">Search Research Papers</h1>
      <p className="text-gray-400 text-sm mb-4">Discover academic papers, track trends, and explore research topics</p>
      <form onSubmit={onSearch} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, title, author, or topic..."
            className="w-full pl-11 pr-4 py-3 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm" />
        </div>
        <input type="number" value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
          placeholder="Year" className="w-24 px-3 py-3 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm text-center" />
        <select value={filters.sortBy} onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
          className="px-3 py-3 bg-[#161b22] border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#4A90E2] transition-colors text-sm cursor-pointer">
          <option value="relevance">Relevance</option><option value="citationCount">Citations</option><option value="year">Year</option>
        </select>
        <button type="submit" disabled={loading}
          className="px-5 py-3 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}Search
        </button>
      </form>
      {error && <div className="mt-3"><Alert type="error" message={error} /></div>}
    </div>
  );
}
