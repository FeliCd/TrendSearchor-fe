import { Trash2, BookOpen, Tag, ExternalLink } from 'lucide-react';

export default function BookmarkCard({ bookmark, onRemove }) {
  const isPaper = bookmark.bookmarkType === 'PAPER';
  return (
    <div className="bg-[#161b22] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`mt-1 p-2.5 rounded-lg flex-shrink-0 ${isPaper ? 'bg-[#4A90E2]/10' : 'bg-purple-500/10'}`}>
            {isPaper ? <BookOpen className="w-5 h-5 text-[#4A90E2]" /> : <Tag className="w-5 h-5 text-purple-400" />}
          </div>
          <div className="min-w-0">
            {isPaper && bookmark.paper ? <PaperBookmarkItem bookmark={bookmark} /> : <KeywordBookmarkItem bookmark={bookmark} />}
          </div>
        </div>
        <button onClick={() => onRemove(bookmark)}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove bookmark">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PaperBookmarkItem({ bookmark }) {
  const paper = bookmark.paper;
  return (
    <>
      <h3 className="text-white font-semibold text-base mb-1 line-clamp-2 leading-snug">{paper.title}</h3>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
        {paper.year && <span className="px-2 py-0.5 bg-[#0d1117] rounded">{paper.year}</span>}
        {paper.citationCount > 0 && <span className="px-2 py-0.5 bg-[#0d1117] text-[#4A90E2] rounded">{paper.citationCount} citations</span>}
        {paper.openAccess && <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded">Open Access</span>}
      </div>
      {paper.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {paper.keywords.slice(0, 5).map((kw, i) => <span key={i} className="px-2 py-0.5 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full">{kw}</span>)}
        </div>
      )}
      <div className="flex items-center gap-3">
        {paper.paperUri && (
          <a href={paper.paperUri} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#4A90E2] hover:text-white transition-colors">
            <ExternalLink className="w-3 h-3" />View Paper
          </a>
        )}
        <span className="text-xs text-gray-500">Saved {new Date(bookmark.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
    </>
  );
}

function KeywordBookmarkItem({ bookmark }) {
  return (
    <>
      <h3 className="text-white font-semibold text-base mb-1">{bookmark.keyword?.displayName || bookmark.keyword?.name || 'Unknown keyword'}</h3>
      <p className="text-xs text-gray-400 mb-2">Research keyword</p>
      <span className="text-xs text-gray-500">Saved {new Date(bookmark.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    </>
  );
}
