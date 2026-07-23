import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TrendChip({ growthRate }) {
  if (growthRate == null) return null;
  const isPositive = growthRate >= 0;

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
      isPositive ? 'text-emerald-400' : 'text-red-400'
    }`}>
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {`${isPositive ? '+' : ''}${Math.round(growthRate * 100)}%`}
    </span>
  );
}
