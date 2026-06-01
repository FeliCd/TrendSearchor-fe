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
      <span className="flex items-center gap-1.5 text-xs text-[#76777d]">
        <TrendingUp className="w-3.5 h-3.5 text-[#246E52]" />
        Trending:
      </span>
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 text-[#76777d] animate-spin" />
      ) : (
        keywords.map((kw) => (
          <button
            key={kw}
            onClick={() => onKeywordClick?.(kw)}
            className="px-3 py-1 rounded-full bg-white hover:bg-[#e5eeff]
              border border-[#c6c6cd]/60 hover:border-[#0058be]/30 text-xs text-[#45464d]
              hover:text-[#0058be] transition-all shadow-sm"
          >
            {kw}
          </button>
        ))
      )}
    </div>
  );
}
