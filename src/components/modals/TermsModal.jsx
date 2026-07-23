import { motion } from 'framer-motion';
import { X, ShieldCheck, FileText } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl bg-[#151515] border-2 border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
              <ShieldCheck className="w-5 h-5 text-[#5ba3ff]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Terms of Service for Paper Publishing</h3>
              <p className="text-xs text-gray-500 mt-0.5">Please review the publishing terms before uploading research content.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            aria-label="Close Terms Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5ba3ff] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              1. Author Ownership & Rights
            </h4>
            <p>
              By uploading a paper to TrendSearchor, you explicitly confirm that you are the author or hold all lawful rights and authorization to publish and disseminate the paper.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5ba3ff] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              2. License & Reuse Options
            </h4>
            <p>
              You select the appropriate distribution license (Creative Commons or All Rights Reserved) upon submission. You retain ownership of your intellectual property subject to the chosen license terms.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5ba3ff] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              3. Previously Published Work & Embargo
            </h4>
            <p>
              For previously published papers, you guarantee that publishing on TrendSearchor does not breach any prior publisher exclusivity agreements. If your publication requires an embargo period, you must specify a valid embargo end date.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5ba3ff] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              4. Moderation & Copyright Complaints
            </h4>
            <p>
              All submitted papers undergo administrative review. TrendSearchor reserves the right to remove, take down, or reject any submission that violates copyright laws, plagiarism standards, or platform rules.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-800 bg-[#1e1e1e] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0058be] hover:bg-[#004395] border-2 border-transparent text-white text-xs font-black uppercase tracking-widest transition-all"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
}
