import { ExternalLink, Bookmark, X, BookOpen, Users, Tag, FileText, Award, Globe } from 'lucide-react';

export default function PaperPreview({ paper, isBookmarked, isToggling, onBookmark, onClose }) {
  if (!paper) return null;

  return (
    <div className="bg-[#151515] flex flex-col h-full border-l-2 border-gray-800">
      <div className="px-6 py-5 border-b-2 border-gray-800 flex items-center justify-between flex-shrink-0 bg-[#1e1e1e]">
        <h2 className="text-white font-black text-sm uppercase tracking-widest">Research Preview</h2>
        <button
          onClick={onClose}
          className="p-1.5 border-2 border-transparent hover:border-gray-700 hover:bg-white/5 text-gray-400 hover:text-white transition-all rounded-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
        <div>
          <h3 className="text-white font-bold text-lg leading-snug mb-3">
            {paper.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            {paper.year && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-gray-800 bg-[#1e1e1e] text-gray-300 rounded-none">
                <FileText className="w-3.5 h-3.5" />
                {paper.year}
              </span>
            )}
            {paper.citationCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-[#0058be]/50 bg-[#0058be]/10 text-[#4A90E2] rounded-none">
                <Award className="w-3.5 h-3.5" />
                {paper.citationCount} citations
              </span>
            )}
            {paper.openAccess && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 rounded-none">
                <Globe className="w-3.5 h-3.5" />
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
            <div className="flex flex-wrap gap-1.5">
              {paper.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 border-2 border-[#0058be]/30 bg-[#0058be]/5 text-[#4A90E2] text-[11px] font-bold uppercase tracking-wide rounded-none"
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
                <span key={i} className="text-gray-300 text-sm bg-gray-800/30 px-2.5 py-1 rounded-lg border border-gray-700/50">
                  {journal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t-2 border-gray-800 flex gap-3 flex-shrink-0 bg-[#1e1e1e]">
        {paper.paperUri && (
          <a
            href={paper.paperUri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-11 border-2 border-transparent bg-[#0058be] text-white rounded-none hover:bg-[#004a9f] transition-all text-[11px] font-black uppercase tracking-widest shadow-none"
          >
            <ExternalLink className="w-4 h-4" />
            View Paper
          </a>
        )}
        <button
          onClick={onBookmark}
          disabled={isToggling || !paper.externalId}
          className={`flex-1 flex items-center justify-center gap-2 h-11 border-2 rounded-none transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-widest shadow-none ${
            isBookmarked
              ? 'bg-[#0058be] border-[#0058be] text-white hover:bg-[#004a9f]'
              : 'bg-transparent border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#2a2a2a]'
          }`}
        >
          {isToggling ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-none animate-spin" />
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
