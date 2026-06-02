import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteConfirmModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    onConfirm();
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

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm overflow-hidden border-2 border-red-500/50 bg-[#151515] p-0 shadow-none"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border-2 bg-red-500/10 border-red-500/50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Delete User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-transparent hover:border-gray-800 hover:bg-[#1e1e1e] text-white transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="mb-6">
            <p className="text-sm text-white font-medium">
              Are you sure you want to delete{' '}
              <span className="text-red-400 font-bold">{user?.fullName || user?.mail}</span>?
            </p>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              This action cannot be undone. All data associated with this account will be permanently removed from the system.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400
                hover:text-white hover:bg-white/5
                transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-3 border-2 border-red-500 text-[10px] font-black uppercase tracking-widest text-white
                bg-red-500 hover:bg-red-600
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
                shadow-none"
            >
              {deleting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete User
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
