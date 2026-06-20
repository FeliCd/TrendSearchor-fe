import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1 || page === 2 || page === totalPages - 1
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t-2 border-gray-800">
      <p className="text-xs text-gray-400">
        Showing <span className="text-white font-semibold">{startItem}–{endItem}</span> of <span className="text-white font-semibold">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 border-2 border-transparent hover:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-[#1e1e1e] disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />Prev
        </button>
        {pageNums.map((page, idx) => (
          <span key={page} className="flex items-center">
            {pageNums[idx - 1] && page - pageNums[idx - 1] > 1 && (
              <span className="px-1.5 text-xs text-gray-700">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-[10px] font-black border-2 transition-all ${
                page === currentPage
                  ? 'bg-[#0058be] text-white border-[#0058be] shadow-none'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e] border-gray-800 hover:border-gray-700 bg-transparent'
              }`}
            >
              {page}
            </button>
          </span>
        ))}
        <button
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 border-2 border-transparent hover:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-[#1e1e1e] disabled:opacity-30 transition-all"
        >
          Next<ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
