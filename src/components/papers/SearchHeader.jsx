import { Search, Loader2, Calendar, Filter, ArrowUpDown } from 'lucide-react';
import Alert from '@/components/ui/Alert';

const SORT_OPTIONS = [
  { value: 'relevance',     label: 'Relevance' },
  { value: 'citationCount', label: 'Most Cited' },
  { value: 'year',          label: 'Newest First' },
];

const YEAR_NOW = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: '', label: 'Any Year' },
  { value: String(YEAR_NOW - 1), label: 'Last 1 year' },
  { value: String(YEAR_NOW - 3), label: 'Last 3 years' },
  { value: String(YEAR_NOW - 5), label: 'Last 5 years' },
  { value: String(YEAR_NOW - 10), label: 'Last 10 years' },
];

export default function SearchHeader({ query, setQuery, filters, setFilters, loading, onSearch, error }) {
  return (
    <div className="w-full">
      <form onSubmit={onSearch} className="flex flex-col gap-3 w-full">
        <div className="flex flex-col xl:flex-row items-stretch gap-3 w-full">
          {/* Main Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#0058be] text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, title, or topic..."
              className="w-full h-12 pl-11 pr-4 bg-[#1e1e1e] border-2 border-gray-800 text-sm text-white
                placeholder:text-gray-500 focus:outline-none focus:border-[#0058be] transition-all rounded-none"
            />
          </div>

          {/* Filter Controls Wrapper */}
          <div className="flex items-center bg-[#1e1e1e] border-2 border-gray-800 h-12 flex-shrink-0 focus-within:border-[#0058be] transition-all">
            
            {/* Custom Year Range */}
            <div className="flex items-center h-full px-4 group">
              <Calendar className="w-3.5 h-3.5 text-gray-500 mr-2" />
              <input
                type="number"
                placeholder="YYYY"
                min="1900"
                max={YEAR_NOW}
                value={filters.yearFrom || ''}
                onChange={(e) => setFilters((f) => ({ ...f, yearFrom: e.target.value }))}
                className="w-[50px] bg-transparent text-sm text-center text-white focus:outline-none placeholder:text-gray-600
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-gray-600 mx-1 font-black">-</span>
              <input
                type="number"
                placeholder="YYYY"
                min="1900"
                max={YEAR_NOW}
                value={filters.yearTo || ''}
                onChange={(e) => setFilters((f) => ({ ...f, yearTo: e.target.value }))}
                className="w-[50px] bg-transparent text-sm text-center text-white focus:outline-none placeholder:text-gray-600
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="w-[2px] h-6 bg-gray-800"></div>

            {/* Year Preset Dropdown */}
            <div className="relative h-full flex items-center px-2 hover:bg-white/5 transition-colors">
              <Filter className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
              <select
                value={filters.yearTo ? '' : (filters.yearFrom || '')}
                onChange={(e) => setFilters((f) => ({
                  ...f,
                  yearFrom: e.target.value,
                  yearTo: ''
                }))}
                className="h-full pl-7 pr-2 bg-transparent text-sm font-medium text-gray-300 focus:outline-none cursor-pointer appearance-none"
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1e1e1e] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[2px] h-6 bg-gray-800"></div>

            {/* Sort Dropdown */}
            <div className="relative h-full flex items-center px-2 hover:bg-white/5 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                className="h-full pl-7 pr-2 bg-transparent text-sm font-medium text-gray-300 focus:outline-none cursor-pointer appearance-none min-w-[130px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1e1e1e] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-8 bg-[#0058be] hover:bg-[#004a9f] text-white font-black uppercase tracking-widest text-[11px] transition-colors
              flex items-center justify-center gap-2 border-2 border-transparent disabled:opacity-50 flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}
    </div>
  );
}
