import { TOPIC_STATUS_CONFIG } from '@/constants/chartConfig';
import TrendChip from '@/components/trends/TrendChip';

export { TOPIC_STATUS_CONFIG, TrendChip };

export function KpiCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs font-medium" style={color ? { color } : undefined}>{label}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export function TrendKpiCard({ keyword, analysis, compact = false }) {
  if (!keyword) return null;
  const config = TOPIC_STATUS_CONFIG[analysis?.status] || TOPIC_STATUS_CONFIG.STABLE;
  const Icon = config.icon;
  const momentumPct = analysis?.momentum != null
    ? `${analysis.momentum >= 0 ? '+' : ''}${Math.round(analysis.momentum * 100)}%` : null;

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
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">YoY Growth</span>
          <TrendChip growthRate={analysis?.growthRate} />
        </div>
        {momentumPct && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Momentum</span>
            <span className={`text-xs font-medium ${analysis.momentum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{momentumPct}</span>
          </div>
        )}
        {analysis?.totalPapers != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total Papers</span>
            <span className="text-xs font-medium text-white">{analysis.totalPapers.toLocaleString()}</span>
          </div>
        )}
        {analysis?.forecastNextYear != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Forecast</span>
            <span className="text-xs font-medium text-blue-400">{analysis.forecastNextYear >= 0 ? '+' : ''}{Math.round(analysis.forecastNextYear * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
