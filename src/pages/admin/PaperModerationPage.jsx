import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldX,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Link2,
  Clock,
  Users,
  BookOpen,
  Tag,
  MessageSquare,
  X,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';
import { usePendingPapers } from '@/hooks/usePendingPapers';
import { PAPER_STATUS } from '@/constants/paperStatus';
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

// ─── Review modal ─────────────────────────────────────────────────────────────
function ReviewModal({ paper, onClose, onSubmit, submitting }) {
  const [decision, setDecision] = useState(null); // 'APPROVED' | 'REJECTED'
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!decision) {
      setError('Please select a decision (Approve or Reject).');
      return;
    }
    if (decision === PAPER_STATUS.REJECTED && !comments.trim()) {
      setError('Please provide feedback when rejecting a paper.');
      return;
    }
    setError('');
    onSubmit(paper.id, { status: decision, comments: comments.trim() });
  };

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
        className="relative w-full max-w-lg bg-[#151515] border-2 border-gray-800 p-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
            <ShieldCheck className="w-5 h-5 text-[#5ba3ff]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Review Paper</h3>
            <p className="text-xs text-gray-500 mt-0.5">Approve or reject this submission</p>
          </div>
        </div>

        {/* Paper info */}
        <div className="p-4 bg-[#1e1e1e] border-2 border-gray-800 mb-5">
          <p className="text-sm font-bold text-white leading-snug mb-2">{paper.title}</p>
          {paper.uploadedBy && (
            <p className="text-xs text-gray-500 mb-1">
              Submitted by: <span className="text-gray-300">{paper.uploadedBy}</span>
            </p>
          )}
          {paper.year && (
            <p className="text-xs text-gray-500">
              Year: <span className="text-gray-300">{paper.year}</span>
            </p>
          )}
          {paper.abstractText && (
            <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-4">
              {paper.abstractText}
            </p>
          )}
          {paper.paperUri && (
            <a
              href={paper.paperUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#5ba3ff] hover:underline mt-2"
            >
              <Link2 className="w-3 h-3" />
              View Paper
            </a>
          )}
        </div>

        {/* Decision buttons */}
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Decision</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setDecision(PAPER_STATUS.APPROVED)}
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 text-[11px] font-black uppercase tracking-widest transition-all
              ${decision === PAPER_STATUS.APPROVED
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-gray-800 bg-[#1e1e1e] text-gray-400 hover:border-emerald-700 hover:text-emerald-400'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setDecision(PAPER_STATUS.REJECTED)}
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 text-[11px] font-black uppercase tracking-widest transition-all
              ${decision === PAPER_STATUS.REJECTED
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'border-gray-800 bg-[#1e1e1e] text-gray-400 hover:border-red-700 hover:text-red-400'
              }`}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>

        {/* Feedback */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Feedback / Comments
            {decision === PAPER_STATUS.REJECTED && (
              <span className="text-red-400 font-black">*</span>
            )}
          </label>
          <textarea
            id="review-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={
              decision === PAPER_STATUS.REJECTED
                ? 'Explain why this paper is being rejected...'
                : 'Optional notes for the researcher...'
            }
            rows={3}
            className="w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-2.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600 resize-none"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 flex items-center gap-2 mb-4"
            >
              <XCircle className="w-4 h-4" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !decision}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${decision === PAPER_STATUS.REJECTED
                ? 'border-red-500 bg-red-500 hover:bg-red-600 text-white'
                : 'border-[#0058be] bg-[#0058be] hover:bg-[#004395] text-white'
              }`}
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {submitting ? 'Processing...' : 'Confirm Decision'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Paper card ───────────────────────────────────────────────────────────────
function PendingPaperCard({ paper, index, onReview }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-2 border-gray-800 bg-[#1a1a1a] hover:border-gray-700 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-start gap-4 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-snug mb-1.5">{paper.title}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {paper.uploadedBy && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {paper.uploadedBy}
              </span>
            )}
            {paper.year && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {paper.year}
              </span>
            )}
            {paper.authors?.length > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {paper.authors.map((a) => a.name || a).slice(0, 2).join(', ')}
                {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
              </span>
            )}
          </div>

          {/* Keywords */}
          {paper.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Tag className="w-3 h-3 text-gray-600 mt-0.5" />
              {paper.keywords.slice(0, 5).map((kw) => (
                <span
                  key={kw}
                  className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[10px] border border-gray-700"
                >
                  {kw}
                </span>
              ))}
              {paper.keywords.length > 5 && (
                <span className="text-[10px] text-gray-600">+{paper.keywords.length - 5} more</span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onReview(paper)}
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-[#0058be] bg-[#0058be]/10 text-[#5ba3ff] text-[10px] font-black uppercase tracking-widest hover:bg-[#0058be] hover:text-white transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Review
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-600 hover:text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            {expanded ? 'Collapse' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Expandable abstract */}
      <AnimatePresence>
        {expanded && paper.abstractText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-gray-800"
          >
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-400 leading-relaxed">{paper.abstractText}</p>
              {paper.paperUri && (
                <a
                  href={paper.paperUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#5ba3ff] hover:underline"
                >
                  <Link2 className="w-3 h-3" />
                  Open Paper Link
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PaperModerationPage() {
  const { papers, loading, error, page, totalPages, totalElements, fetchPending, setPapers } =
    usePendingPapers();

  const [reviewTarget, setReviewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleOpenReview = (paper) => setReviewTarget(paper);
  const handleCloseReview = () => setReviewTarget(null);

  const handleSubmitReview = async (id, payload) => {
    setSubmitting(true);
    try {
      await paperUploadService.reviewPaper(id, payload);
      // Optimistically remove from list
      setPapers((prev) => prev.filter((p) => p.id !== id));
      setReviewTarget(null);
      const action = payload.status === PAPER_STATUS.APPROVED ? 'approved' : 'rejected';
      showToast(`Paper ${action} successfully.`, payload.status === PAPER_STATUS.APPROVED ? 'success' : 'warning');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151515] relative">
      <PageBackground />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="relative z-10">
        <PageHeader
          title="Paper Moderation"
          description="Review and approve researcher-submitted papers."
        />

        <div className="w-full px-6 pb-10 mt-6">
          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            <div className="border-2 border-amber-500/30 bg-amber-500/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{totalElements}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Pending Review
                </p>
              </div>
            </div>
            <div className="border-2 border-gray-800 bg-[#1a1a1a] p-4 flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#0058be]/40 bg-[#0058be]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#5ba3ff]" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{papers.length}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  On This Page
                </p>
              </div>
            </div>
            <div className="border-2 border-gray-800 bg-[#1a1a1a] p-4 flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{totalPages}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Total Pages
                </p>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-gray-800 bg-[#1a1a1a] p-6"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Awaiting Moderation</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Approved papers will be prioritized in search results.
                  </p>
                </div>
              </div>
              <button
                onClick={() => fetchPending(page)}
                className="p-2 border-2 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <p className="text-sm text-red-400 py-10 text-center">{error}</p>
            ) : papers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 border-2 border-gray-800 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-gray-700" />
                </div>
                <p className="text-sm font-bold text-gray-400">All caught up!</p>
                <p className="text-xs text-gray-600 mt-1">No papers are awaiting review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {papers.map((paper, i) => (
                  <PendingPaperCard
                    key={paper.id}
                    paper={paper}
                    index={i}
                    onReview={handleOpenReview}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => fetchPending(page - 1)}
                  disabled={page === 0}
                  className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-gray-400">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => fetchPending(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal
            paper={reviewTarget}
            onClose={handleCloseReview}
            onSubmit={handleSubmitReview}
            submitting={submitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
