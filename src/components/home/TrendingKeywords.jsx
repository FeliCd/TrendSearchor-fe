import { TrendingUp } from 'lucide-react';

const TRENDING_KEYWORDS = ['Large Language Models', 'Federated Learning', 'CRISPR', 'Quantum ML', 'RAG'];

export default function TrendingKeywords({ onKeywordClick }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="flex items-center gap-1.5 text-xs text-[#8b949e]">
        <TrendingUp className="w-3.5 h-3.5 text-[#246E52]" />
        Trending:
      </span>
      {TRENDING_KEYWORDS.map((kw) => (
        <button
          key={kw}
          onClick={() => onKeywordClick?.(kw)}
          className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#4A90E2]/20
            border border-white/10 hover:border-[#4A90E2]/30 text-xs text-[#8b949e]
            hover:text-[#4A90E2] transition-all"
        >
          {kw}
        </button>
      ))}
    </div>
  );
}
