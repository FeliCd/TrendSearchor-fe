import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0d1117] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">Delete User</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">
                Are you sure you want to delete <span className="text-red-400">{user?.username}</span>?
              </p>
              <p className="text-xs text-[#8b949e] mt-1">
                This action cannot be undone. All data associated with this account will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8b949e]
                hover:text-white hover:bg-white/5 border border-white/[0.08] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-red-600/20"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
