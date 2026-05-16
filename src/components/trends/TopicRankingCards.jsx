import { TrendingUp, TrendingDown, Minus, Flame, Sparkles, Shield, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  EMERGING: {
    label: 'Emerging',
    icon: Sparkles,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  HOT: {
    label: 'Hot',
    icon: Flame,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
  STABLE: {
    label: 'Stable',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  MATURE: {
    label: 'Mature',
    icon: Shield,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  DECLINING: {
    label: 'Declining',
    icon: TrendingDown,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  },
};

function TrendIcon({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.STABLE;
  const Icon = config.icon;
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return <Icon className={`${sz} ${config.color}`} />;
}

export function TopicRankingCard({ topic, onClick, compact = false }) {
  const config = STATUS_CONFIG[topic.status] || STATUS_CONFIG.STABLE;
  const Icon = config.icon;
  const growthPercent = topic.growthRate != null
    ? `${topic.growthRate >= 0 ? '+' : ''}${Math.round(topic.growthRate * 100)}%`
    : '—';

  return (
    <button
      onClick={() => onClick && onClick(topic)}
      className={`w-full text-left p-3 rounded-xl border ${config.border} ${config.bg} 
        hover:brightness-125 transition-all group`}
    >
      <div className="flex items-start gap-2">
        {!compact && (
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center mt-0.5">
            <span className="text-xs font-bold text-gray-400">#{topic.rank}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
              {topic.displayName || topic.keyword}
            </span>
            <TrendIcon status={topic.status} size="sm" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium ${topic.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthPercent}
            </span>
            <span className="text-gray-500">
              {topic.totalPapers?.toLocaleString() || 0} papers
            </span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs px-1.5 py-0.5 rounded border ${config.badge}`}>
                {config.label}
              </span>
              {topic.trendScore != null && (
                <span className="text-xs text-gray-600">
                  Score: {topic.trendScore.toFixed(1)}
                </span>
              )}
            </div>
          )}
        </div>
        {!compact && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-1" />}
      </div>
    </button>
  );
}

export function TopicRankingSection({ title, topics, onTopicClick, icon: Icon, emptyMessage }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      {topics.length === 0 ? (
        <p className="text-xs text-gray-600 italic py-2">{emptyMessage || 'No topics'}</p>
      ) : (
        <div className="space-y-1.5">
          {topics.map((topic) => (
            <TopicRankingCard
              key={topic.keyword}
              topic={topic}
              onClick={onTopicClick}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}
