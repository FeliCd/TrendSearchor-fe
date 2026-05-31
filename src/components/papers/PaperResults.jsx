import { BookOpen, Search, ExternalLink, Bookmark, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function MousePointerIcon({ isSelected }) {
  return (
    <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${isSelected ? 'text-[#4A90E2]' : 'text-gray-600'}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );
}

function PaperCard({ paper, isBookmarked, isToggling, isSelected, onSelect, onBookmark }) {
  return (
    <div onClick={() => onSelect(paper)}
      className={`bg-[#161b22] border rounded-xl p-4 transition-all cursor-pointer ${
        isSelected ? 'border-[#4A90E2]/60 shadow-[0_0_0_1px_#4A90E2/40]' : 'border-white/10 hover:border-white/20'
      }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <MousePointerIcon isSelected={isSelected} />
            <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">{paper.title}</h3>
          </div>
          {paper.abstract && <p className="text-gray-400 text-sm mb-2.5 line-clamp-2 ml-5">{paper.abstract}</p>}
          <div className="flex flex-wrap items-center gap-2 text-xs ml-5">
            {paper.year && <span className="px-2 py-0.5 bg-[#0d1117] text-gray-300 rounded">{paper.year}</span>}
            {paper.citationCount > 0 && <span className="px-2 py-0.5 bg-[#0d1117] text-[#4A90E2] rounded">{paper.citationCount} citations</span>}
            {paper.openAccess && <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded">Open Access</span>}
            {paper.authors?.length > 0 && <span className="text-gray-400">{paper.authors.slice(0, 3).map((a) => a.name).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}</span>}
          </div>
          {paper.keywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 ml-5">
              {paper.keywords.slice(0, 5).map((kw, i) => <span key={i} className="px-2 py-0.5 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full">{kw}</span>)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {paper.paperUri && (
            <a href={paper.paperUri} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={(e) => { e.stopPropagation(); onBookmark(paper); }} disabled={isToggling || !paper.externalId}
            className={`p-1.5 border rounded-lg transition-all disabled:opacity-50 ${
              isBookmarked ? 'bg-[#4A90E2]/20 border-[#4A90E2] text-[#4A90E2]' : 'bg-[#0d1117] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaperResults({ papers, loading, hasSearched, total, page, totalPages, loadingBookmarks,
  bookmarkedIds, togglingId, selectedPaper, onSelect, onBookmark, onPageChange }) {

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>;
  if (hasSearched && papers.length === 0) return (
    <div className="text-center py-12">
      <Search className="w-12 h-12 mx-auto text-gray-600 mb-4" />
      <h3 className="text-white text-lg font-medium mb-2">No papers found</h3>
      <p className="text-gray-400 text-sm">Try adjusting your search query or filters</p>
    </div>
  );
  if (!hasSearched) return (
    <div className="text-center py-12">
      <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-4" />
      <h3 className="text-white text-lg font-medium mb-2">Start searching</h3>
      <p className="text-gray-400 text-sm">Enter a keyword to discover research papers</p>
    </div>
  );

  return (
    <div className="px-6 pb-6">
      {papers.length > 0 && (
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="text-gray-400 text-sm">Found <span className="text-white font-semibold">{total.toLocaleString()}</span> results</div>
          {loadingBookmarks && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Loader2 className="w-3 h-3 animate-spin" />Checking bookmarks...</div>}
        </div>
      )}
      <div className="space-y-3">
        {papers.map((paper) => (
          <PaperCard key={paper.externalId} paper={paper}
            isBookmarked={bookmarkedIds.has(paper.externalId)}
            isToggling={togglingId === paper.externalId}
            isSelected={selectedPaper?.externalId === paper.externalId}
            onSelect={onSelect} onBookmark={onBookmark} />
        ))}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 pb-2">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
              className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors text-sm">Previous</button>
            <span className="px-4 py-2 text-gray-400 text-sm">Page {page + 1} of {totalPages}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-[#161b22] border border-white/10 text-white rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors text-sm">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
