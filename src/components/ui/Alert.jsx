import { AlertCircle, CheckCircle, X } from 'lucide-react';

const VARIANTS = {
  error: {
    wrapper: 'bg-red-500/10 border-red-500/20 text-red-400',
    icon: AlertCircle,
  },
  success: {
    wrapper: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: CheckCircle,
  },
};

export default function Alert({ variant = 'error', message, onDismiss }) {
  const { wrapper, icon: Icon } = VARIANTS[variant] || VARIANTS.error;

  return (
    <div className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-sm ${wrapper}`}>
      <span className="mt-0.5 flex-shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-0.5 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
