import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Bookmark, X, BookOpen, Users, Tag, FileText, Award, Globe, Bold, Italic, Underline as UnderlineIcon, Loader2, FolderPlus } from 'lucide-react';
import { useLenis } from '@/providers/LenisProvider';
import { noteService } from '@/services/noteService';

export default function PaperPreview({ paper, isBookmarked, isToggling, onBookmark, onAddToCollection, onClose }) {
  const [note, setNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const editorRef = useRef(null);
  const scrollRef = useRef(null);
  const { initScroller } = useLenis();

  // Native scrolling is more reliable for nested components than nested Lenis instances

  useEffect(() => {
    if (paper && paper.externalId) {
      const fetchNote = async () => {
        setNoteLoading(true);
        try {
          const data = await noteService.getNote(paper.externalId);
          const fetchedNote = data?.content || '';
          setNote(fetchedNote);
          if (editorRef.current) {
            editorRef.current.innerHTML = fetchedNote;
          }
        } catch (err) {
          console.error('Failed to fetch note:', err);
        } finally {
          setNoteLoading(false);
        }
      };
      fetchNote();
    } else {
      setNote('');
      if (editorRef.current) editorRef.current.innerHTML = '';
    }
  }, [paper]);

  const handleSaveNote = async () => {
    if (!paper || !paper.externalId) return;
    const content = editorRef.current?.innerHTML || '';
    setNoteSaving(true);
    try {
      await noteService.saveNote(paper.externalId, content);
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note.');
    } finally {
      setNoteSaving(false);
    }
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  if (!paper) return null;

  return (
    <div className="bg-[#151515] flex flex-col flex-1 min-h-0 h-full border-l-2 border-gray-800">
      <div className="px-6 py-5 border-b-2 border-gray-800 flex items-center justify-between flex-shrink-0 bg-[#1e1e1e]">
        <h2 className="text-white font-black text-sm uppercase tracking-widest">Research Preview</h2>
        <button
          onClick={onClose}
          className="p-1.5 border-2 border-transparent hover:border-gray-700 hover:bg-white/5 text-gray-400 hover:text-white transition-all rounded-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} data-lenis-prevent="true" className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5 scroll-smooth">
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
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Authors ({paper.authors.length})
              </h4>
              {paper.authors.length > 5 && (
                <button
                  onClick={() => setShowAllAuthors(!showAllAuthors)}
                  className="text-[10px] text-[#0058be] hover:text-white font-bold uppercase tracking-widest transition-colors"
                >
                  {showAllAuthors ? 'Show less' : `+ ${paper.authors.length - 5} more`}
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {(showAllAuthors ? paper.authors : paper.authors.slice(0, 5)).map((author, i) => (
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
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Keywords ({paper.keywords.length})
              </h4>
              {paper.keywords.length > 8 && (
                <button
                  onClick={() => setShowAllKeywords(!showAllKeywords)}
                  className="text-[10px] text-[#0058be] hover:text-white font-bold uppercase tracking-widest transition-colors"
                >
                  {showAllKeywords ? 'Show less' : `+ ${paper.keywords.length - 8} more`}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(showAllKeywords ? paper.keywords : paper.keywords.slice(0, 8)).map((kw, i) => (
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

        <div className="pt-4 flex gap-3 mt-2">
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
          <button
            onClick={() => onAddToCollection(paper)}
            disabled={!paper.externalId}
            className="flex-1 flex items-center justify-center gap-2 h-11 border-2 rounded-none transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-widest shadow-none bg-transparent border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#2a2a2a]"
          >
            <FolderPlus className="w-4 h-4" /> Collection
          </button>
        </div>

        <div className="pt-6 border-t-2 border-gray-800 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[#0058be] text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Research Notes & Ideas
            </h4>
            <div className="flex bg-[#1e1e1e] border-2 border-gray-800">
              <button onClick={() => applyFormat('bold')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Bold">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => applyFormat('italic')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border-l-2 border-gray-800" title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => applyFormat('underline')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border-l-2 border-gray-800" title="Underline">
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            {noteLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#151515]/80 z-10 border-2 border-gray-800">
                <Loader2 className="w-6 h-6 text-[#0058be] animate-spin" />
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable={!noteLoading}
              suppressContentEditableWarning
              className="w-full h-32 bg-[#151515] border-2 border-gray-800 text-white p-3 text-sm focus:outline-none focus:border-[#0058be] transition-colors overflow-y-auto relative"
              placeholder="Jot down your ideas, questions, or how this paper relates to your research..."
              onInput={(e) => setNote(e.currentTarget.innerHTML)}
            />
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            [contenteditable]:empty:before {
              content: attr(placeholder);
              color: #4b5563;
              pointer-events: none;
              display: block; /* For Firefox */
            }
          `}} />
          
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleSaveNote}
              disabled={noteSaving || noteLoading}
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-[#0058be] text-white text-[10px] font-black uppercase tracking-widest border-2 border-transparent transition-colors disabled:opacity-50"
            >
              {noteSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {noteSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
