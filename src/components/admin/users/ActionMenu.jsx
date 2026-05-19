import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2 } from 'lucide-react';

export default function ActionMenu({ user, onEdit, onView, onDelete, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -4 }} transition={{ duration: 0.15 }}
        className="fixed w-44 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 py-1"
        style={{ left: 'var(--menu-left, auto)', top: 'var(--menu-top, auto)' }}>
        <button onClick={() => { onView(user); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#c9d1d9] hover:bg-white/[0.04] transition-colors">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Eye className="w-3 h-3 text-blue-400" /></div>
          View Details
        </button>
        <button onClick={() => { onEdit(user); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#c9d1d9] hover:bg-white/[0.04] transition-colors">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Edit2 className="w-3 h-3 text-emerald-400" /></div>
          Edit User
        </button>
        <div className="h-px bg-white/[0.04] mx-3 my-1" />
        <button onClick={() => { onDelete(user); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/[0.06] transition-colors">
          <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center"><Trash2 className="w-3 h-3" /></div>
          Delete User
        </button>
      </motion.div>
    </>
  );
}
