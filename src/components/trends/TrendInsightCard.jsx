import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const STATUS_COLORS = {
  EMERGING: 'border-emerald-500/40 bg-emerald-500/5',
  HOT: 'border-red-500/40 bg-red-500/5',
  STABLE: 'border-blue-500/40 bg-blue-500/5',
  MATURE: 'border-purple-500/40 bg-purple-500/5',
  DECLINING: 'border-gray-500/40 bg-gray-500/5',
};

const STATUS_LABELS = {
  EMERGING: { text: 'Emerging', color: 'text-emerald-400', icon: TrendingUp },
  HOT: { text: 'Hot', color: 'text-red-400', icon: TrendingUp },
  STABLE: { text: 'Stable', color: 'text-blue-400', icon: Minus },
  MATURE: { text: 'Mature', color: 'text-purple-400', icon: Minus },
  DECLINING: { text: 'Declining', color: 'text-gray-400', icon: TrendingDown },
};

export default function TrendInsightCard({ analysis }) {
  if (!analysis || !analysis.insight) {
    return (
      <div className={`border rounded-xl p-4 ${STATUS_COLORS.STABLE}`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">AI Insight</span>
        </div>
        <p className="text-sm text-gray-400">No insight available yet. Try searching for a keyword.</p>
      </div>
    );
  }

  const status = analysis.status || 'STABLE';
  const label = STATUS_LABELS[status] || STATUS_LABELS.STABLE;
  const StatusIcon = label.icon;

  const growthPercent = analysis.growthRate != null
    ? `${analysis.growthRate >= 0 ? '+' : ''}${Math.round(analysis.growthRate * 100)}%`
    : null;

  const forecastPercent = analysis.forecastNextYear != null && analysis.cumulativeGrowth != null
    ? `${analysis.forecastNextYear >= 0 ? '+' : ''}${Math.round(analysis.forecastNextYear * 100)}%`
    : null;

  return (
    <div className={`border rounded-xl p-4 ${STATUS_COLORS[status] || STATUS_COLORS.STABLE}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${label.color}`} />
          <span className="text-sm font-medium text-white">AI Insight</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${label.color} border-current/30`}>
          {label.text}
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-3">{analysis.insight}</p>

      <div className="flex items-center gap-4 text-xs">
        {growthPercent && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">YoY Growth:</span>
            <span className={`font-medium ${analysis.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthPercent}
            </span>
          </div>
        )}
        {analysis.momentum != null && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Momentum:</span>
            <span className={`font-medium ${analysis.momentum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {analysis.momentum >= 0 ? '+' : ''}{Math.round(analysis.momentum * 100)}%
            </span>
          </div>
        )}
        {forecastPercent && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Forecast:</span>
            <span className="font-medium text-blue-400">
              {forecastPercent} next year
            </span>
          </div>
        )}
      </div>

      {analysis.forecastConfidence != null && analysis.forecastConfidence > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">
            Forecast confidence: {Math.round(analysis.forecastConfidence * 100)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${Math.round(analysis.forecastConfidence * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
