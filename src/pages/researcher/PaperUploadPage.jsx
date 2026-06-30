import { useState, useCallback } from 'react';
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
  Link2,
  BookOpen,
  Users,
  Tag,
  CalendarDays,
  AlignLeft,
} from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';
import { useMyUploads } from '@/hooks/useMyUploads';
import { PAPER_STATUS, PAPER_STATUS_LABELS, PAPER_STATUS_STYLES } from '@/constants/paperStatus';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

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
function TagInput({ label, icon: Icon, values, onChange, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputValue('');
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
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        <AnimatePresence>
          {values.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-xs font-medium"
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
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-2.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2.5 border-2 border-gray-700 bg-[#1e1e1e] text-gray-400 hover:border-[#0058be] hover:text-[#5ba3ff] transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-gray-600 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

// ─── Upload form ──────────────────────────────────────────────────────────────
function UploadPaperForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    abstractText: '',
    year: new Date().getFullYear(),
    paperUri: '',
    authors: [],
    journals: [],
    keywords: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await paperUploadService.uploadPaper({
        ...form,
        year: Number(form.year),
      });
      setForm({
        title: '',
        abstractText: '',
        year: new Date().getFullYear(),
        paperUri: '',
        authors: [],
        journals: [],
        keywords: [],
      });
      onSuccess('Paper submitted successfully and is now awaiting review.');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload paper. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-2.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
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

      {/* Abstract */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          <AlignLeft className="w-3.5 h-3.5" />
          Abstract
        </label>
        <textarea
          id="paper-abstract"
          value={form.abstractText}
          onChange={handleChange('abstractText')}
          placeholder="Summarize the paper's contribution..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Year & URI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Publication Year
          </label>
          <input
            id="paper-year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={form.year}
            onChange={handleChange('year')}
            className={inputClass}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            <Link2 className="w-3.5 h-3.5" />
            Paper URL / DOI
          </label>
          <input
            id="paper-uri"
            type="url"
            value={form.paperUri}
            onChange={handleChange('paperUri')}
            placeholder="https://doi.org/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Authors */}
      <TagInput
        label="Authors"
        icon={Users}
        values={form.authors}
        onChange={(authors) => setForm((prev) => ({ ...prev, authors }))}
        placeholder="Add author name..."
      />

      {/* Journals */}
      <TagInput
        label="Journals / Conferences"
        icon={BookOpen}
        values={form.journals}
        onChange={(journals) => setForm((prev) => ({ ...prev, journals }))}
        placeholder="Add journal or conference name..."
      />

      {/* Keywords */}
      <TagInput
        label="Keywords"
        icon={Tag}
        values={form.keywords}
        onChange={(keywords) => setForm((prev) => ({ ...prev, keywords }))}
        placeholder="Add keyword..."
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
            <XCircle className="w-4 h-4" />
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
function PaperRow({ paper, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-2 border-gray-800 bg-[#1a1a1a] hover:border-gray-700 transition-colors"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate leading-snug">{paper.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
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
        <ChevronRight
          className={`w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-gray-800"
          >
            <div className="p-4 space-y-3">
              {paper.abstractText && (
                <p className="text-sm text-gray-400 leading-relaxed">{paper.abstractText}</p>
              )}
              {paper.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {paper.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-medium border border-gray-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              {paper.paperUri && (
                <a
                  href={paper.paperUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#5ba3ff] hover:underline"
                >
                  <Link2 className="w-3 h-3" />
                  View Paper
                </a>
              )}
              {paper.status === PAPER_STATUS.REJECTED && paper.statusComments && (
                <div className="p-3 bg-red-500/5 border border-red-500/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                    Rejection Feedback
                  </p>
                  <p className="text-sm text-red-300">{paper.statusComments}</p>
                </div>
              )}
              {paper.status === PAPER_STATUS.APPROVED && paper.statusComments && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                    Reviewer Notes
                  </p>
                  <p className="text-sm text-emerald-300">{paper.statusComments}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── My Uploads panel ─────────────────────────────────────────────────────────
function MyUploadsPanel() {
  const { papers, loading, error, page, totalPages, totalElements, fetchUploads } = useMyUploads();

  const statusCounts = papers.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
        <div className="flex flex-wrap gap-2 mb-4">
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
      ) : (
        <div className="space-y-3">
          {papers.map((paper, i) => (
            <PaperRow key={paper.id ?? paper.externalId} paper={paper} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
              <MyUploadsPanel />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
