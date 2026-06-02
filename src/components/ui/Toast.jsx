import { XCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

const VARIANT_STYLES = {
  error: {
    container: 'bg-red-500/10 border-red-500/30 text-red-400',
    icon: XCircle,
  },
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    icon: CheckCircle,
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    icon: AlertTriangle,
  },
};

/**
 * Single toast item.
 */
function ToastItem({ message, type = 'error', onClose }) {
  const variant = VARIANT_STYLES[type] || VARIANT_STYLES.error;
  const Icon = variant.icon;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-2xl text-sm font-medium
        backdrop-blur-sm animate-[slideInRight_0.3s_ease-out] min-w-[300px] max-w-[420px]
        ${variant.container}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Toast container that renders a stack of toasts.
 * Usage: <ToastContainer toasts={toasts} onRemove={removeToast} />
 */
export function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * Single toast (legacy compat).
 */
export default function Toast({ message, type = 'success' }) {
  return <ToastItem message={message} type={type} />;
}
