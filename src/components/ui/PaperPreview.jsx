import { ExternalLink, Bookmark, X, BookOpen, Users, Tag, FileText, Award, Globe } from 'lucide-react';

export default function PaperPreview({ paper, isBookmarked, isToggling, onBookmark, onClose }) {
  if (!paper) return null;

  return (
    <div className="bg-[#161b22] flex flex-col h-full">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <h2 className="text-white font-semibold text-base">Research Preview</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
        <div>
          <h3 className="text-white font-bold text-lg leading-snug mb-3">
            {paper.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {paper.year && (
              <span className="flex items-center gap-1 px-2 py-1 bg-[#0d1117] text-gray-300 rounded">
                <FileText className="w-3 h-3" />
                {paper.year}
              </span>
            )}
            {paper.citationCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-[#0d1117] text-[#4A90E2] rounded">
                <Award className="w-3 h-3" />
                {paper.citationCount} citations
              </span>
            )}
            {paper.openAccess && (
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded">
                <Globe className="w-3 h-3" />
                Open Access
              </span>
            )}
          </div>
        </div>

        {paper.authors?.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Authors
            </h4>
            <div className="space-y-1.5">
              {paper.authors.map((author, i) => (
                <div key={i} className="text-gray-300 text-sm">
                  {author.name}
                  {author.affiliation && (
                    <span className="text-gray-500 text-xs ml-1">({author.affiliation})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {paper.keywords?.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-full border border-[#4A90E2]/20"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {paper.abstract && (
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Abstract
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {paper.abstract}
            </p>
          </div>
        )}

        {paper.journals?.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Published In
            </h4>
            <div className="flex flex-wrap gap-2">
              {paper.journals.map((journal, i) => (
                <span key={i} className="text-gray-300 text-sm bg-[#0d1117] px-2.5 py-1 rounded-lg border border-white/5">
                  {journal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 flex gap-3 flex-shrink-0">
        {paper.paperUri && (
          <a
            href={paper.paperUri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Paper
          </a>
        )}
        <button
          onClick={onBookmark}
          disabled={isToggling || !paper.externalId}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-all disabled:opacity-50 text-sm font-medium ${
            isBookmarked
              ? 'bg-[#4A90E2]/20 border-[#4A90E2] text-[#4A90E2]'
              : 'bg-[#0d1117] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}
        >
          {isToggling ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
