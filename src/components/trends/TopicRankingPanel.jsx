import { TrendingUp, TrendingDown, Minus, Flame, Sparkles, Shield, Award, ChevronRight } from 'lucide-react';

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

export function TopicCard({ topic, onClick, compact = false }) {
  const config = STATUS_CONFIG[topic.status] || STATUS_CONFIG.STABLE;
  const Icon = config.icon;

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(topic)}
        className={`w-full text-left p-2.5 rounded-xl border ${config.border} ${config.bg} 
          hover:brightness-125 transition-all group`}
      >
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-black/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500">#{topic.rank}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate group-hover:text-blue-300 transition-colors">
              {topic.displayName || topic.keyword}
            </p>
          </div>
          <TrendChip growthRate={topic.growthRate} />
          <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick?.(topic)}
      className={`w-full text-left p-3 rounded-xl border ${config.border} ${config.bg} 
        hover:brightness-125 transition-all group`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center mt-0.5">
          <span className="text-xs font-bold text-gray-500">#{topic.rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
              {topic.displayName || topic.keyword}
            </span>
            <Icon className={`w-3.5 h-3.5 ${config.color} flex-shrink-0`} />
          </div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <TrendChip growthRate={topic.growthRate} />
            <span className="text-gray-500">
              {(topic.totalPapers || topic.recentPapers || 0).toLocaleString()} papers
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${config.badge}`}>
              {config.label}
            </span>
            {topic.trendScore != null && (
              <span className="text-[10px] text-gray-600">
                Score: {topic.trendScore.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}

export function TopicRankingPanel({ risingTopics = [], stableTopics = [], decliningTopics = [], onTopicClick }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Rising</span>
        </div>
        {risingTopics.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1 py-2">No rising topics</p>
        ) : (
          risingTopics.slice(0, 5).map((t) => (
            <TopicCard key={t.keyword} topic={t} onClick={onTopicClick} compact />
          ))
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Stable</span>
        </div>
        {stableTopics.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1 py-2">No stable topics</p>
        ) : (
          stableTopics.slice(0, 5).map((t) => (
            <TopicCard key={t.keyword} topic={t} onClick={onTopicClick} compact />
          ))
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Declining</span>
        </div>
        {decliningTopics.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic px-1 py-2">No declining topics</p>
        ) : (
          decliningTopics.slice(0, 5).map((t) => (
            <TopicCard key={t.keyword} topic={t} onClick={onTopicClick} compact />
          ))
        )}
      </div>
    </div>
  );
}

export { STATUS_CONFIG, TrendChip };
