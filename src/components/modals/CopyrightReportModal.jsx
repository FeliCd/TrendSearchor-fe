import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle, RefreshCw } from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';

const MAX_REASON_LENGTH = 2000;

export default function CopyrightReportModal({ isOpen, onClose, paperId, paperTitle, onSuccess }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError('Please provide a detailed reason for the copyright report.');
      return;
    }

    if (trimmedReason.length > MAX_REASON_LENGTH) {
      setError(`Reason must not exceed ${MAX_REASON_LENGTH} characters.`);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await paperUploadService.reportCopyright(paperId, { reason: trimmedReason });
      setReason('');
      onSuccess?.('Copyright report submitted successfully.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit copyright report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        data-lenis-prevent="true"
        className="relative w-full max-w-xl bg-[#151515] border-2 border-gray-800 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-red-500/30 flex items-center justify-center bg-red-500/10">
              <Flag className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Copyright Violation</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">
                Paper: <span className="text-gray-300 font-medium">{paperTitle || `#${paperId}`}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Reason for Report <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={6}
              maxLength={MAX_REASON_LENGTH}
              placeholder="Describe the copyright infringement or ownership dispute in detail..."
              className="w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-4 py-3 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600 resize-none"
            />
            <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500">
              <span>Maximum {MAX_REASON_LENGTH} characters</span>
              <span className={reason.length > MAX_REASON_LENGTH * 0.9 ? 'text-amber-400' : ''}>
                {reason.length} / {MAX_REASON_LENGTH}
              </span>
            </div>
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 border-2 border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border-2 border-gray-800 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 border-2 border-transparent text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Flag className="w-4 h-4" />
              )}
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
