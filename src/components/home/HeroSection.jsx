import { Search, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const trendingKeywords = ['Large Language Models', 'Federated Learning', 'CRISPR', 'Quantum ML', 'RAG'];

  return (
    <section className="relative overflow-hidden pt-20 pb-24 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-32 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 text-xs font-medium mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Semantic Scholar · OpenAlex · Crossref</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight text-[#e6edf3] mb-5 animate-slide-up">
          Track the pulse of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            scientific research
          </span>
        </h1>

        <p className="text-[#8b949e] text-lg leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Discover emerging research trends, track publication patterns across journals,
          and stay ahead in your field — all in one intelligent dashboard.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative flex items-center bg-[#161b22] border border-[#21262d] hover:border-primary-600/50 focus-within:border-primary-600 rounded-xl overflow-hidden transition-colors shadow-2xl">
            <Search className="absolute left-4 w-5 h-5 text-[#8b949e] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, author, or journal..."
              className="flex-1 bg-transparent pl-12 pr-4 py-4 text-[#e6edf3] placeholder-[#8b949e] text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="m-1.5 btn-primary text-sm px-5 py-2.5 shrink-0"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Trending keywords */}
        <div className="flex flex-wrap items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <span className="flex items-center gap-1.5 text-xs text-[#8b949e]">
            <TrendingUp className="w-3.5 h-3.5 text-accent-500" />
            Trending:
          </span>
          {trendingKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-primary-600/20 border border-white/10 hover:border-primary-600/30 text-xs text-[#8b949e] hover:text-primary-400 transition-all"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
