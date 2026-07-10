import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Check,
  Search,
  RotateCcw,
} from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';
import { usePendingPapers } from '@/hooks/usePendingPapers';
import { useModerationHistory } from '@/hooks/useModerationHistory';
import { PAPER_STATUS, PAPER_STATUS_LABELS, PAPER_STATUS_STYLES } from '@/constants/paperStatus';
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
    [PAPER_STATUS.REVOKED]: <RotateCcw className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest ${style}`}>
      {icons[status]}
      {label}
    </span>
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
            <div
              className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-4 prose-invert break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: paper.abstractText }}
            />
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

// ─── Revoke Confirmation Modal ───────────────────────────────────────────────
function RevokeModal({ paper, onClose, onConfirm, submitting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-md bg-[#151515] border-2 border-red-500/30 p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 border-2 border-red-500 flex items-center justify-center bg-red-500/10">
            <RotateCcw className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Revoke Moderation</h3>
            <p className="text-xs text-gray-500 mt-0.5">Revert paper status to pending review</p>
          </div>
        </div>
        <div className="p-4 bg-[#1e1e1e] border-2 border-gray-800 mb-5">
          <p className="text-sm font-bold text-white leading-snug mb-1">{paper.title}</p>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            Current status: <StatusBadge status={paper.status} />
          </p>
        </div>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Are you sure you want to revoke this decision? The paper will be removed from public view and moved back to the "Awaiting Moderation" list for re-evaluation.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {submitting ? 'Revoking...' : 'Confirm Revoke'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Pending Paper card ───────────────────────────────────────────────────────
function PendingPaperCard({ paper, index, onReview, onPreview }) {
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
            onClick={() => onPreview(paper)}
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-600 hover:text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── History Paper card ───────────────────────────────────────────────────────
function HistoryPaperCard({ paper, index, onPreview, onRevoke, onReview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-2 border-gray-800 bg-[#1a1a1a] hover:border-gray-700 transition-colors"
    >
      <div className="flex items-start gap-4 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-snug mb-1.5">{paper.title}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <StatusBadge status={paper.status} />
            {paper.uploadedBy && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Submitted by: {paper.uploadedBy}
              </span>
            )}
            {paper.year && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {paper.year}
              </span>
            )}
          </div>

          {/* Feedback section */}
          {paper.statusComments && (
            <div className="mt-3 p-3 bg-[#1e1e1e] border border-gray-800 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0058be] mb-0.5">Moderation Comments</p>
                <p className="text-xs text-gray-400">{paper.statusComments}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          {paper.status === PAPER_STATUS.REVOKED ? (
            <button
              onClick={() => onReview(paper)}
              className="flex items-center gap-1.5 px-3 py-2 border-2 border-[#0058be] bg-[#0058be]/10 text-[#5ba3ff] text-[10px] font-black uppercase tracking-widest hover:bg-[#0058be] hover:text-white transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Review
            </button>
          ) : (
            <button
              onClick={() => onRevoke(paper)}
              className="flex items-center gap-1.5 px-3 py-2 border-2 border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Revoke
            </button>
          )}
          <button
            onClick={() => onPreview(paper)}
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-600 hover:text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PaperModerationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
  const [previewTarget, setPreviewTarget] = useState(null);

  const pending = usePendingPapers();
  const history = useModerationHistory();

  const [reviewTarget, setReviewTarget] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleOpenReview = (paper) => setReviewTarget(paper);
  const handleCloseReview = () => setReviewTarget(null);

  const handleOpenPreview = (paper) => setPreviewTarget(paper);
  const handleClosePreview = () => setPreviewTarget(null);

  const handleOpenRevoke = (paper) => setRevokeTarget(paper);
  const handleCloseRevoke = () => setRevokeTarget(null);

  const handleSubmitReview = async (id, payload) => {
    setSubmitting(true);
    try {
      await paperUploadService.reviewPaper(id, payload);
      // Optimistically remove from pending list
      pending.setPapers((prev) => prev.filter((p) => p.id !== id));
      setReviewTarget(null);
      const action = payload.status === PAPER_STATUS.APPROVED ? 'approved' : 'rejected';
      showToast(`Paper ${action} successfully.`, payload.status === PAPER_STATUS.APPROVED ? 'success' : 'warning');

      // Refresh both lists to update counts
      pending.fetchPending(0, searchQuery);
      history.fetchHistory(0, searchQuery, history.status);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await paperUploadService.revokePaper(revokeTarget.id);
      // Optimistically update status to REVOKED in history list
      history.setPapers((prev) => 
        prev.map((p) => p.id === revokeTarget.id ? { ...p, status: 'REVOKED' } : p)
            .filter((p) => history.status === 'ALL' || history.status === p.status)
      );
      showToast('Paper moderation status revoked successfully.', 'success');
      setRevokeTarget(null);

      // Refresh both lists to update counts and pending list
      pending.fetchPending(0, searchQuery);
      history.fetchHistory(0, searchQuery, history.status);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to revoke paper.', 'error');
    } finally {
      setRevoking(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'pending') {
      pending.fetchPending(pending.page, searchQuery);
    } else {
      history.fetchHistory(history.page, searchQuery, history.status);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (activeTab === 'pending') {
      pending.fetchPending(0, searchQuery);
    } else {
      history.fetchHistory(0, searchQuery, history.status);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (activeTab === 'pending') {
      pending.fetchPending(0, '');
    } else {
      history.fetchHistory(0, '', history.status);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    history.fetchHistory(0, searchQuery, newStatus);
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
                <p className="text-2xl font-black text-white">{pending.totalElements}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Pending Review
                </p>
              </div>
            </div>
            <div className="border-2 border-[#0058be]/30 bg-[#0058be]/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#0058be]/40 bg-[#0058be]/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#5ba3ff]" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{history.totalElements}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[#5ba3ff]">
                  Moderated History
                </p>
              </div>
            </div>
            <div className="border-2 border-gray-800 bg-[#1a1a1a] p-4 flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">
                  {activeTab === 'pending' ? pending.totalPages : history.totalPages}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Total Pages
                </p>
              </div>
            </div>
          </motion.div>

          {/* List panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-gray-800 bg-[#1a1a1a]"
          >
            {/* Tab header and actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b-2 border-gray-800 bg-[#1e1e1e] p-4 gap-4">
              {/* Tab Toggles */}
              <div className="flex items-center border-2 border-gray-700 h-10 flex-shrink-0">
                <button
                  id="tab-pending-moderation"
                  onClick={() => { setActiveTab('pending'); pending.fetchPending(0, searchQuery); }}
                  className={`px-4 h-full text-[11px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'pending'
                      ? 'bg-[#0058be] text-white'
                      : 'text-gray-500 hover:text-white hover:bg-[#252525]'
                    }`}
                >
                  Awaiting Moderation ({pending.totalElements})
                </button>
                <button
                  id="tab-moderation-history"
                  onClick={() => { setActiveTab('history'); history.fetchHistory(0, searchQuery, history.status); }}
                  className={`px-4 h-full text-[11px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'history'
                      ? 'bg-[#0058be] text-white'
                      : 'text-gray-500 hover:text-white hover:bg-[#252525]'
                    }`}
                >
                  Moderation History ({history.totalElements})
                </button>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 lg:justify-end">
                {/* Search Box */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or email..."
                    className="w-full bg-[#151515] border-2 border-gray-800 text-white text-xs pl-8 pr-8 py-2 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600 h-10"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Status Filter for History tab */}
                {activeTab === 'history' && (
                  <div className="flex items-center border-2 border-gray-700 h-10">
                    {['ALL', 'APPROVED', 'REJECTED', 'REVOKED'].map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => handleStatusFilterChange(statusOption)}
                        className={`px-3 h-full text-[10px] font-bold uppercase tracking-widest transition-colors ${history.status === statusOption
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-500 hover:text-white hover:bg-[#252525]'
                          }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleRefresh}
                  className="p-2 border-2 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all h-10 flex items-center justify-center bg-[#1a1a1a]"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {activeTab === 'pending' ? (
                // Pending Tab View
                pending.loading ? (
                  <div className="flex justify-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : pending.error ? (
                  <p className="text-sm text-red-400 py-10 text-center">{pending.error}</p>
                ) : pending.papers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 border-2 border-gray-800 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-7 h-7 text-gray-700" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">All caught up!</p>
                    <p className="text-xs text-gray-600 mt-1">No papers matching your search are awaiting review.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pending.papers.map((paper, i) => (
                      <PendingPaperCard
                        key={paper.id}
                        paper={paper}
                        index={i}
                        onReview={handleOpenReview}
                        onPreview={handleOpenPreview}
                      />
                    ))}
                  </div>
                )
              ) : (
                // History Tab View
                history.loading ? (
                  <div className="flex justify-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : history.error ? (
                  <p className="text-sm text-red-400 py-10 text-center">{history.error}</p>
                ) : history.papers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 border-2 border-gray-800 flex items-center justify-center mb-4">
                      <FileText className="w-7 h-7 text-gray-700" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No moderation history</p>
                    <p className="text-xs text-gray-600 mt-1">No papers matching your criteria were found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.papers.map((paper, i) => (
                      <HistoryPaperCard
                        key={paper.id}
                        paper={paper}
                        index={i}
                        onPreview={handleOpenPreview}
                        onRevoke={handleOpenRevoke}
                        onReview={handleOpenReview}
                      />
                    ))}
                  </div>
                )
              )}

              {/* Pagination */}
              {activeTab === 'pending' && pending.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => pending.fetchPending(pending.page - 1, searchQuery)}
                    disabled={pending.page === 0}
                    className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-gray-400">
                    Page {pending.page + 1} of {pending.totalPages}
                  </span>
                  <button
                    onClick={() => pending.fetchPending(pending.page + 1, searchQuery)}
                    disabled={pending.page >= pending.totalPages - 1}
                    className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* History Pagination */}
              {activeTab === 'history' && history.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => history.fetchHistory(history.page - 1, searchQuery, history.status)}
                    disabled={history.page === 0}
                    className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-gray-400">
                    Page {history.page + 1} of {history.totalPages}
                  </span>
                  <button
                    onClick={() => history.fetchHistory(history.page + 1, searchQuery, history.status)}
                    disabled={history.page >= history.totalPages - 1}
                    className="p-2 border-2 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
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

      {/* Revoke modal */}
      <AnimatePresence>
        {revokeTarget && (
          <RevokeModal
            paper={revokeTarget}
            onClose={handleCloseRevoke}
            onConfirm={handleSubmitRevoke}
            submitting={revoking}
          />
        )}
      </AnimatePresence>

      {/* Preview modal */}
      <AnimatePresence>
        {previewTarget && (
          <PaperPreviewModal
            paper={previewTarget}
            onClose={handleClosePreview}
            onViewPaper={() => navigate(`/admin/paper/${previewTarget.id}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
