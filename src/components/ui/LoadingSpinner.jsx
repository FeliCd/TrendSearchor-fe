import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 font-bold">
      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      {label && <span>{label}</span>}
    </span>
  );
}

