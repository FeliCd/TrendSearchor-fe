import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  RefreshCw,
  BookOpen,
  Users,
  Tag,
  AlignLeft,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Highlighter,
  Info,
} from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';
import { topicService } from '@/services/topicService';
import { useMyUploads } from '@/hooks/useMyUploads';
import { PAPER_STATUS, PAPER_STATUS_LABELS, PAPER_STATUS_STYLES } from '@/constants/paperStatus';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';
import PaperPreviewModal from '@/components/modals/PaperPreviewModal';

// ─── Background grid ─────────────────────────────────────────────────────────
function PageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{
        backgroundImage:
          'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const label = PAPER_STATUS_LABELS[status] || status;
  const style = PAPER_STATUS_STYLES[status] || 'bg-gray-500/10 text-gray-400 border-2 border-gray-500/30';
  const icons = {
    [PAPER_STATUS.PENDING]: <Clock className="w-3 h-3" />,
    [PAPER_STATUS.APPROVED]: <CheckCircle2 className="w-3 h-3" />,
    [PAPER_STATUS.REJECTED]: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest ${style}`}>
      {icons[status]}
      {label}
    </span>
  );
}

// ─── Tag input helper ─────────────────────────────────────────────────────────
function TagInput({ label, icon: Icon, values, onChange, placeholder, required, hint, validate, validationMessage }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (validate && !validate(trimmed)) {
        setError(validationMessage || 'Invalid input');
        return;
      }
      if (!values.includes(trimmed)) {
        onChange([...values, trimmed]);
      }
    }
    setInputValue('');
    setError('');
  };

  const removeTag = (tag) => onChange(values.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <AnimatePresence>
            {values.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          type="button"
          onClick={addTag}
          title="Add item"
          className="px-3 py-1.5 border-2 border-gray-700 bg-[#1e1e1e] text-gray-400 hover:border-[#0058be] hover:text-[#5ba3ff] transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 mt-0.5">
        <p className="text-[10px] text-gray-600">Press Enter or comma to add</p>
        {hint && (
          <p className="flex items-center gap-1 text-[10px] text-gray-600">
            <Info className="w-3 h-3 flex-shrink-0" />
            {hint}
          </p>
        )}
        {error && (
          <p className="text-[10px] text-red-400 mt-0.5">{error}</p>
        )}
      </div>
    </div>
  );
}

// ─── Async Tag Input helper ───────────────────────────────────────────────────
function AsyncTagInput({ label, icon: Icon, values, onChange, placeholder, required, hint, fetchSuggestions }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(inputValue.trim());
        let finalResults = [];
        if (Array.isArray(results)) {
          finalResults = results;
        } else if (results && Array.isArray(results.data)) {
          finalResults = results.data;
        } else if (results && Array.isArray(results.content)) {
          finalResults = results.content;
        }
        setSuggestions(finalResults);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const addTag = (tag) => {
    if (!values.includes(tag)) {
      onChange([...values, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tag) => onChange(values.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && !isLoading) {
        if (suggestions.length > 0) {
          addTag(suggestions[0].name || suggestions[0]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <AnimatePresence>
            {values.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="flex gap-2 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (inputValue.trim()) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          type="button"
          onClick={() => {
            if (showSuggestions && !isLoading) {
              if (suggestions.length > 0) {
                addTag(suggestions[0].name || suggestions[0]);
              } else if (inputValue.trim()) {
                addTag(inputValue.trim());
              }
            }
          }}
          disabled={!inputValue.trim()}
          title="Add item"
          className="px-3 py-1.5 border-2 border-gray-700 bg-[#1e1e1e] text-gray-400 hover:border-[#0058be] hover:text-[#5ba3ff] transition-all disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && inputValue.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            data-lenis-prevent="true"
            className="absolute top-full z-50 left-0 right-0 mt-1 bg-[#1e1e1e] border-2 border-gray-800 shadow-xl max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 text-xs text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" /> Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="py-1">
                {suggestions.map((item, idx) => {
                  const tagName = item.name || item;
                  return (
                    <li
                      key={idx}
                      onClick={() => addTag(tagName)}
                      className="px-3 py-2 text-sm text-gray-300 hover:bg-[#0058be]/20 hover:text-[#5ba3ff] cursor-pointer transition-colors"
                    >
                      {tagName}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                onClick={() => addTag(inputValue.trim())}
                className="p-3 text-sm text-[#5ba3ff] hover:bg-[#0058be]/20 cursor-pointer border-t border-dashed border-gray-800 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create new tag: "{inputValue.trim()}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-0.5 mt-0.5">
        <p className="text-[10px] text-gray-600">Type to search for an existing tag or create a new one</p>
        {hint && (
          <p className="flex items-center gap-1 text-[10px] text-gray-600">
            <Info className="w-3 h-3 flex-shrink-0" />
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Rich text abstract toolbar ───────────────────────────────────────────────
const ABSTRACT_TOOLBAR_BUTTONS = [
  { command: 'bold', Icon: Bold, title: 'Bold' },
  { command: 'italic', Icon: Italic, title: 'Italic' },
  { command: 'underline', Icon: UnderlineIcon, title: 'Underline' },
  { command: 'insertUnorderedList', Icon: List, title: 'Bullet list' },
  { command: 'insertOrderedList', Icon: ListOrdered, title: 'Numbered list' },
  { command: 'hiliteColor', Icon: Highlighter, title: 'Highlight', value: '#FDE047' },
];

function AbstractEditor({ editorRef, required }) {
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        <AlignLeft className="w-3.5 h-3.5" />
        Abstract {required && <span className="text-red-400">*</span>}
      </label>

      {/* Toolbar */}
      <div className="flex items-center gap-0 border-2 border-b-0 border-gray-800 bg-[#1e1e1e] px-1 py-1">
        {ABSTRACT_TOOLBAR_BUTTONS.map(({ command, Icon, title, value }, idx) => (
          <button
            key={command}
            type="button"
            title={title}
            onMouseDown={(e) => {
              e.preventDefault(); // prevent losing focus from editor
              applyFormat(command, value ?? null);
            }}
            className={`flex items-center justify-center w-8 h-7 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors rounded-none ${idx > 0 ? 'border-l border-gray-800' : ''}`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        id="paper-abstract"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Summarize the paper's contribution, methodology, and key findings..."
        className="w-full min-h-[160px] bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-4 py-3 focus:border-[#0058be] focus:outline-none transition-colors overflow-y-auto leading-relaxed break-words"
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          selection.deleteFromDocument();
          selection.getRangeAt(0).insertNode(document.createTextNode(text));
          selection.collapseToEnd();

          const event = new Event('input', { bubbles: true });
          e.target.dispatchEvent(event);
        }}
      />

      {/* Inline style for placeholder */}
      <style>{`
        #paper-abstract:empty::before {
          content: attr(data-placeholder);
          color: #4b5563;
          pointer-events: none;
          display: block;
        }
        #paper-abstract ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
        #paper-abstract ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
        #paper-abstract b, #paper-abstract strong { font-weight: 700; }
        #paper-abstract i, #paper-abstract em { font-style: italic; }
        #paper-abstract u { text-decoration: underline; }
      `}</style>
    </div>
  );
}

// ─── Upload form ──────────────────────────────────────────────────────────────
function UploadPaperForm({ onSuccess }) {
  const { user } = useAuth();
  const abstractRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    collab: [],
    journals: [],
    keywords: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const abstractText = abstractRef.current?.innerHTML || '';
    const plainText = abstractRef.current?.textContent?.trim() || '';

    // Validations
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!plainText) {
      setFormError('Abstract is required.');
      return;
    }
    if (form.journals.length === 0) {
      setFormError('At least one journal or conference is required.');
      return;
    }
    if (form.keywords.length === 0) {
      setFormError('At least one keyword is required.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      const allAuthors = [];
      const uploaderName = user?.fullName || user?.mail || 'Unknown Author';
      allAuthors.push(uploaderName);
      allAuthors.push(...form.collab);

      await paperUploadService.uploadPaper({
        title: form.title.trim(),
        abstractText,
        authors: allAuthors,
        journals: form.journals,
        keywords: form.keywords,
        // year is omitted — backend derives from submission timestamp
        // paperUri is omitted — system-generated on approval
      });

      // Reset form
      setForm({ title: '', collab: [], journals: [], keywords: [] });
      if (abstractRef.current) abstractRef.current.innerHTML = '';

      onSuccess('Paper submitted successfully and is now awaiting review.');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload paper. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
          <FileText className="w-3.5 h-3.5" />
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="paper-title"
          type="text"
          value={form.title}
          onChange={handleChange('title')}
          placeholder="Enter research paper title"
          required
          className={inputClass}
        />
      </div>

      {/* Abstract — rich text editor */}
      <AbstractEditor editorRef={abstractRef} required />

      {/* Collab */}
      <TagInput
        label="Collab"
        icon={Users}
        values={form.collab}
        onChange={(collab) => setForm((prev) => ({ ...prev, collab }))}
        placeholder="Add collaborator gmail and press Enter..."
        required={false}
        validate={(val) => val.toLowerCase().endsWith('@gmail.com')}
        validationMessage="Collaborator must be a @gmail.com address"
      />

      {/* Journals */}
      <TagInput
        label="Journals / Conferences"
        icon={BookOpen}
        values={form.journals}
        onChange={(journals) => setForm((prev) => ({ ...prev, journals }))}
        placeholder="Type journal or conference name..."
        required
        hint="Journals are curated by administrators. Type to suggest a journal."
      />

      {/* Keywords */}
      <AsyncTagInput
        label="Keywords / Topics"
        icon={Tag}
        values={form.keywords}
        onChange={(keywords) => setForm((prev) => ({ ...prev, keywords }))}
        placeholder="Add keyword or topic..."
        required
        hint="Type to search existing topics. If not found, you can create a new one."
        fetchSuggestions={(query) => topicService.searchTopics(query)}
      />

      {/* Error */}
      <AnimatePresence>
        {formError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-400 flex items-center gap-2"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {formError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0058be] hover:bg-[#004395] border-2 border-transparent text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </motion.button>
    </form>
  );
}

// ─── Paper row ────────────────────────────────────────────────────────────────
function PaperRow({ paper, index, onPreview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-2 border-gray-800 bg-[#1a1a1a] hover:border-gray-700 transition-colors p-3 flex items-start gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate leading-snug">{paper.title}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <StatusBadge status={paper.status} />
          {paper.year && (
            <span className="text-[10px] text-gray-500 font-medium">{paper.year}</span>
          )}
          {paper.authors?.length > 0 && (
            <span className="text-[10px] text-gray-500">
              {paper.authors.map((a) => a.name || a).slice(0, 3).join(', ')}
              {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 mt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(paper);
          }}
          className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-600 hover:text-white transition-all"
        >
          Preview
        </button>
      </div>
    </motion.div>
  );
}

// ─── My Uploads panel ─────────────────────────────────────────────────────────
function MyUploadsPanel({ onPreviewPaper }) {
  const { papers, loading, error, page, totalPages, totalElements, fetchUploads } = useMyUploads(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const statusCounts = papers.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors?.some((author) => {
        const name = author.name || author;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      }) ||
      paper.keywords?.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || paper.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white">My Submissions</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalElements} paper{totalElements !== 1 ? 's' : ''} submitted
          </p>
        </div>
        <button
          onClick={() => fetchUploads(page)}
          className="p-2 border-2 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stat chips */}
      {papers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span
              key={status}
              className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${PAPER_STATUS_STYLES[status]}`}
            >
              {count} {PAPER_STATUS_LABELS[status] || status}
            </span>
          ))}
        </div>
      )}

      {/* Search and Filter bar */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#1e1e1e] border-2 border-gray-800 text-white text-xs px-3 py-1.5 focus:border-[#0058be] focus:outline-none placeholder-gray-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1e1e1e] border-2 border-gray-800 text-white text-xs px-2 py-1.5 focus:border-[#0058be] focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-sm text-red-400 py-8 text-center">{error}</p>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 border-2 border-gray-800 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-700" />
          </div>
          <p className="text-sm text-gray-500">No papers submitted yet.</p>
          <p className="text-xs text-gray-700 mt-1">Use the form to submit your first paper.</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-800 bg-[#1e1e1e]/50 p-4">
          <p className="text-xs text-gray-500">No matching papers found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPapers.map((paper, i) => (
            <PaperRow key={paper.id ?? paper.externalId} paper={paper} index={i} onPreview={onPreviewPaper} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => fetchUploads(page - 1)}
            disabled={page === 0}
            className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => fetchUploads(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PaperUploadPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewTarget, setPreviewTarget] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleUploadSuccess = (message) => {
    showToast(message);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#151515] relative">
      <PageBackground />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="relative z-10">
        <PageHeader
          title="Upload Research Paper"
          description="Submit papers for review. Approved papers appear in search results."
        />

        <div className="w-full px-6 pb-10 mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left – Upload form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="border-2 border-gray-800 bg-[#1a1a1a] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
                  <Upload className="w-5 h-5 text-[#5ba3ff]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Submit New Paper</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your paper will be reviewed before going live.
                  </p>
                </div>
              </div>
              <UploadPaperForm onSuccess={handleUploadSuccess} />
            </motion.div>

            {/* Right – My uploads */}
            <motion.div
              key={refreshKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="border-2 border-gray-800 bg-[#1a1a1a] p-6"
            >
              <MyUploadsPanel onPreviewPaper={setPreviewTarget} />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewTarget && (
          <PaperPreviewModal
            paper={previewTarget}
            onClose={() => setPreviewTarget(null)}
            onViewPaper={() => navigate(`/researcher/paper/${previewTarget.id || previewTarget.externalId}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
