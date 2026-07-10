import { motion } from 'framer-motion';
import {
  X,
  FileText,
  Users,
  Clock,
  Tag,
  BookOpen,
  Link2,
} from 'lucide-react';

// ---- Styles for rendered abstract HTML ----
const ABSTRACT_STYLES = `
  .preview-abstract { word-break: break-word; overflow-wrap: break-word; }
  .preview-abstract ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
  .preview-abstract ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
  .preview-abstract b, .preview-abstract strong { font-weight: 700; color: #e5e7eb; }
  .preview-abstract i, .preview-abstract em { font-style: italic; }
  .preview-abstract u { text-decoration: underline; }
  .preview-abstract p { margin-bottom: 0.5rem; }
`;

/**
 * PaperPreviewModal
 * Full-screen modal to display the complete paper details including the full abstract.
 *
 * @param {Object} props
 * @param {Object} props.paper - The paper data object
 * @param {Function} props.onViewPaper - Callback when "View Paper" is clicked
 */
export default function PaperPreviewModal({ paper, onClose, onViewPaper, hideYear }) {
  if (!paper) return null;

  const authors = paper.authors || [];
  const keywords = paper.keywords || [];
  const journals = paper.journals || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl bg-[#151515] border-2 border-gray-800 overflow-y-auto max-h-[90vh]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b-2 border-gray-800 bg-[#1e1e1e]">
          <div className="flex items-center gap-3 pr-10">
            <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10 flex-shrink-0">
              <FileText className="w-5 h-5 text-[#5ba3ff]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#5ba3ff] mb-1">
                Paper Preview
              </p>
              <h3 className="text-base font-bold text-white leading-snug break-words">
                {paper.title}
              </h3>
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-500">
            {paper.uploadedBy && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] border border-gray-800">
                <Users className="w-3 h-3" />
                <span className="text-gray-300">{paper.uploadedBy}</span>
              </span>
            )}
            {paper.year && !hideYear && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] border border-gray-800">
                <Clock className="w-3 h-3" />
                <span className="text-gray-300">{paper.year}</span>
              </span>
            )}
            {paper.paperUri && (
              <a
                href={paper.paperUri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] border border-gray-800 hover:border-[#0058be] hover:text-[#5ba3ff] transition-colors"
              >
                <Link2 className="w-3 h-3" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Authors */}
          {authors.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Authors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {authors.map((author) => {
                  const name = author.name || author;
                  return (
                    <span
                      key={name}
                      className="px-2 py-1 bg-[#1e1e1e] border border-gray-800 text-xs text-gray-300"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Journals */}
          {journals.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Journals / Conferences
              </p>
              <div className="flex flex-wrap gap-1.5">
                {journals.map((journal) => {
                  const name = journal.name || journal;
                  return (
                    <span
                      key={name}
                      className="px-2 py-1 bg-[#1e1e1e] border border-gray-800 text-xs text-gray-300"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                <Tag className="w-3.5 h-3.5" />
                Keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-[10px] font-bold uppercase tracking-wider"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Abstract - Full content */}
          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
              <FileText className="w-3.5 h-3.5" />
              Abstract
            </p>
            {paper.abstractText ? (
              <div className="p-4 bg-[#1e1e1e] border-2 border-gray-800">
                <style>{ABSTRACT_STYLES}</style>
                <div
                  className="preview-abstract text-sm text-gray-400 leading-relaxed prose-invert"
                  dangerouslySetInnerHTML={{ __html: paper.abstractText }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">
                No abstract provided for this paper.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-800 bg-[#1e1e1e] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Close Preview
          </button>
          {onViewPaper && (
            <button
              onClick={onViewPaper}
              className="flex-1 px-4 py-3 bg-[#0058be] hover:bg-[#004395] border-2 border-transparent text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              View Paper
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
