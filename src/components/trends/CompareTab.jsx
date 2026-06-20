import { GitCompare, XCircle, Loader2 } from 'lucide-react';
import TopicComparisonChart from './TopicComparisonChart';

export default function CompareTab({ compareKeywords, comparison, comparisonLoading, trendingKeywords, onCompareToggle }) {
  return (
    <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="w-4 h-4 text-[#0058be]" />
        <h3 className="text-sm font-semibold text-white">Compare Topics</h3>
        <span className="text-[10px] text-gray-500">Select 2–4 keywords to compare</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {compareKeywords.map((kw) => (
          <div key={kw} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0058be]/10 border border-[#0058be]/30 rounded-none text-xs text-[#0058be]">
            <span>{kw}</span>
            <button onClick={() => onCompareToggle(kw)} className="hover:text-red-400"><XCircle className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        {compareKeywords.length < 4 && (
          <select
            onChange={(e) => { if (e.target.value) { onCompareToggle(e.target.value); e.target.value = ''; } }}
            value="" className="bg-[#151515] border-2 border-gray-800 rounded-none px-2.5 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-[#0058be]/50">
            <option value="">+ Add keyword</option>
            {trendingKeywords.filter((kw) => !compareKeywords.includes(kw.displayName || kw.keyword))
              .map((kw) => <option key={kw.keyword} value={kw.displayName || kw.keyword}>{kw.displayName || kw.keyword}</option>)}
          </select>
        )}
      </div>
      {comparisonLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#0058be] animate-spin" /></div>
      ) : comparison ? (
        <TopicComparisonChart comparison={comparison} />
      ) : compareKeywords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <GitCompare className="w-8 h-8 opacity-20 mb-2" />
          <p className="text-sm">Select at least 2 keywords to compare</p>
        </div>
      ) : null}
    </div>
  );
}
