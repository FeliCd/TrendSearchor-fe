import { TrendingUp, TrendingDown, ChevronRight, Sparkles, Flame, Shield, Award, TrendingDown as TrendingDownAlt } from 'lucide-react';
import { TOPIC_STATUS_CONFIG } from '@/constants/chartConfig';
import TrendChip from '@/components/trends/TrendChip';


const ICON_MAP = { Sparkles, Flame, Shield, Award, TrendingDown: TrendingDownAlt };

export function TopicCard({ topic, onClick, compact = false }) {
  const config = TOPIC_STATUS_CONFIG[topic.status] || TOPIC_STATUS_CONFIG.STABLE;
  const Icon = ICON_MAP[config.icon] || Shield;

  return (
    <button onClick={() => onClick?.(topic)}
      className={`w-full text-left p-${compact ? '2.5' : '3'} rounded-xl border ${config.border} ${config.bg} hover:brightness-125 transition-all group`}>
      <div className={`flex ${compact ? 'items-center gap-2' : 'items-start gap-2'}`}>
        <div className={`flex-shrink-0 w-${compact ? '6' : '8'} h-${compact ? '6' : '8'} rounded-${compact ? 'md' : 'lg'} bg-black/20 flex items-center justify-center mt-0.5`}>
          <span className="text-[10px] font-bold text-gray-500">#{topic.rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-${compact ? 'xs' : 'sm'} font-medium text-white truncate group-hover:text-blue-300 transition-colors`}>
              {topic.displayName || topic.keyword}
            </span>
            {!compact && <Icon className={`w-3.5 h-3.5 ${config.color} flex-shrink-0`} />}
          </div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <TrendChip growthRate={topic.growthRate} />
            <span className="text-gray-500">{(topic.totalPapers || topic.recentPapers || 0).toLocaleString()} papers</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${config.badge}`}>{config.label}</span>
              {topic.trendScore != null && <span className="text-[10px] text-gray-600">Score: {topic.trendScore.toFixed(1)}</span>}
            </div>
          )}
        </div>
        <ChevronRight className={`w-${compact ? '3' : '4'} h-${compact ? '3' : '4'} text-gray-600 group-hover:text-gray-400 flex-shrink-0 ${!compact ? 'mt-1' : ''}`} />
      </div>
    </button>
  );
}

export function TopicRankingPanel({ risingTopics = [], stableTopics = [], decliningTopics = [], onTopicClick }) {
  const columns = [
    { label: 'Rising', icon: TrendingUp, color: 'text-emerald-400', data: risingTopics },
    { label: 'Stable', icon: Shield, color: 'text-blue-400', data: stableTopics },
    { label: 'Declining', icon: TrendingDown, color: 'text-gray-400', data: decliningTopics },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {columns.map(({ label, icon: Icon, color, data }) => (
        <div key={label} className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className={`text-[10px] font-semibold ${color} uppercase tracking-wider`}>{label}</span>
          </div>
          {data.length === 0 ? (
            <p className="text-[10px] text-gray-600 italic px-1 py-2">No {label.toLowerCase()} topics</p>
          ) : (
            data.slice(0, 5).map((t) => <TopicCard key={t.keyword} topic={t} onClick={onTopicClick} compact />)
          )}
        </div>
      ))}
    </div>
  );
}
