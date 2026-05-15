import { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { trendService } from '@/services/trendService';

const DEFAULT_KEYWORDS = ['Large Language Models', 'Federated Learning', 'CRISPR', 'Quantum ML', 'RAG'];

export default function TrendingKeywords({ onKeywordClick }) {
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const data = await trendService.getTrendingKeywords(10);
        if (data && data.length > 0) {
          setKeywords(data.map(k => k.displayName || k.name));
        }
      } catch (err) {
        console.error('Failed to load trending keywords:', err);
      } finally {
        setLoading(false);
      }
    };
    loadKeywords();
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="flex items-center gap-1.5 text-xs text-[#8b949e]">
        <TrendingUp className="w-3.5 h-3.5 text-[#246E52]" />
        Trending:
      </span>
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 text-[#8b949e] animate-spin" />
      ) : (
        keywords.map((kw) => (
          <button
            key={kw}
            onClick={() => onKeywordClick?.(kw)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#4A90E2]/20
              border border-white/10 hover:border-[#4A90E2]/30 text-xs text-[#8b949e]
              hover:text-[#4A90E2] transition-all"
          >
            {kw}
          </button>
        ))
      )}
    </div>
  );
}
