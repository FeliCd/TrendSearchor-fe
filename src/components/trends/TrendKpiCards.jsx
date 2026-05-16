import { TrendingUp, TrendingDown, Minus, Flame, Sparkles, Shield, Award } from 'lucide-react';

const STATUS_CONFIG = {
  EMERGING: {
    label: 'Emerging',
    icon: Sparkles,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400',
    dot: 'bg-emerald-400',
  },
  HOT: {
    label: 'Hot',
    icon: Flame,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400',
    dot: 'bg-red-400',
  },
  STABLE: {
    label: 'Stable',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400',
    dot: 'bg-blue-400',
  },
  MATURE: {
    label: 'Mature',
    icon: Award,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/10 text-purple-400',
    dot: 'bg-purple-400',
  },
  DECLINING: {
    label: 'Declining',
    icon: TrendingDown,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/10 text-gray-400',
    dot: 'bg-gray-400',
  },
};

function TrendChip({ growthRate }) {
  if (growthRate == null) return null;
  const isPositive = growthRate >= 0;
  const pct = `${isPositive ? '+' : ''}${Math.round(growthRate * 100)}%`;

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
      isPositive ? 'text-emerald-400' : 'text-red-400'
    }`}>
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {pct}
    </span>
  );
}

export function KpiCard({ label, value, subtext, icon: Icon, colorClass = 'text-blue-400', bgClass = 'bg-blue-500/10' }) {
  return (
    <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgClass}`}>
            <Icon className={`w-4 h-4 ${colorClass}`} />
          </div>
        )}
        {subtext && (
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">{subtext}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export function TrendKpiCard({ keyword, analysis, compact = false }) {
  if (!keyword) return null;

  const config = STATUS_CONFIG[analysis?.status] || STATUS_CONFIG.STABLE;
  const Icon = config.icon;

  const growthPct = analysis?.growthRate != null
    ? `${analysis.growthRate >= 0 ? '+' : ''}${Math.round(analysis.growthRate * 100)}%`
    : '—';

  const momentumPct = analysis?.momentum != null
    ? `${analysis.momentum >= 0 ? '+' : ''}${Math.round(analysis.momentum * 100)}%`
    : null;

  if (compact) {
    return (
      <div className={`p-2.5 rounded-xl border ${config.border} ${config.bg}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-medium text-white truncate">{keyword}</span>
          <Icon className={`w-3 h-3 ${config.color} flex-shrink-0`} />
        </div>
        <TrendChip growthRate={analysis?.growthRate} />
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className="text-sm font-semibold text-white">{keyword}</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.badge}`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">YoY Growth</span>
          <TrendChip growthRate={analysis?.growthRate} />
        </div>
        {momentumPct && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Momentum</span>
            <span className={`text-xs font-medium ${analysis.momentum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {momentumPct}
            </span>
          </div>
        )}
        {analysis?.totalPapers != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total Papers</span>
            <span className="text-xs font-medium text-white">
              {analysis.totalPapers.toLocaleString()}
            </span>
          </div>
        )}
        {analysis?.forecastNextYear != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Forecast</span>
            <span className="text-xs font-medium text-blue-400">
              {analysis.forecastNextYear >= 0 ? '+' : ''}{Math.round(analysis.forecastNextYear * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { STATUS_CONFIG, TrendChip };
