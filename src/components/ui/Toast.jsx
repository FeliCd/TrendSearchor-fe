import { XCircle, CheckCircle } from 'lucide-react';

/**
 * Reusable toast notification.
 * Usage: <Toast message={msg} type="success|error" />
 */
export default function Toast({ message, type = 'success' }) {
  const isError = type === 'error';
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3
        rounded-xl border shadow-xl text-sm font-medium
        animate-[slideInRight_0.3s_ease-out]
        ${isError
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}
    >
      {isError
        ? <XCircle className="w-4 h-4" />
        : <CheckCircle className="w-4 h-4" />
      }
      {message}
    </div>
  );
}
