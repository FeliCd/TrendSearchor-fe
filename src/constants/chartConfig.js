import { TrendingDown as TrendingDownAlt, Sparkles, Flame, Shield, Award } from 'lucide-react';

export const TOPIC_STATUS_CONFIG = {
  EMERGING: { label: 'Emerging', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-2 border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 font-bold uppercase tracking-wider text-[10px] rounded-none', dot: 'bg-emerald-400' },
  HOT: { label: 'Hot', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-2 border-red-500/30', badge: 'bg-red-500/10 text-red-400 border-2 border-red-500/30 font-bold uppercase tracking-wider text-[10px] rounded-none', dot: 'bg-red-400' },
  STABLE: { label: 'Stable', icon: Shield, color: 'text-blue-400', bg: 'bg-[#0058be]/5', border: 'border-2 border-[#0058be]/30', badge: 'bg-[#0058be]/10 text-[#0058be] border-2 border-[#0058be]/30 font-bold uppercase tracking-wider text-[10px] rounded-none', dot: 'bg-[#0058be]' },
  MATURE: { label: 'Mature', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-2 border-purple-500/30', badge: 'bg-purple-500/10 text-purple-400 border-2 border-purple-500/30 font-bold uppercase tracking-wider text-[10px] rounded-none', dot: 'bg-purple-400' },
  DECLINING: { label: 'Declining', icon: TrendingDownAlt, color: 'text-gray-400', bg: 'bg-gray-500/5', border: 'border-2 border-gray-500/30', badge: 'bg-gray-500/10 text-gray-400 border-2 border-gray-500/30 font-bold uppercase tracking-wider text-[10px] rounded-none', dot: 'bg-gray-400' },
};


export const KEYWORD_COLORS = [
  '#0058be', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899', '#84cc16',
];

export const CHART_TOOLTIP_STYLE = {
  background: '#1e1e1e',
  border: '2px solid #1f2937',
  borderRadius: '0px',
  fontSize: '12px',
  color: 'white',
};
