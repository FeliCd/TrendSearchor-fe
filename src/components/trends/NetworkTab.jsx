import { Loader2 } from 'lucide-react';
import KeywordNetworkGraph from './KeywordNetworkGraph';

export default function NetworkTab({ selectedKeyword, networkData, networkLoading, onKeywordSelect }) {
  return (
    <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[#0058be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 className="text-sm font-semibold text-white">Keyword Relationships</h3>
        <span className="text-[10px] text-gray-500">{selectedKeyword ? `Related to "${selectedKeyword}"` : 'Search a keyword first'}</span>
      </div>
      {networkLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#0058be] animate-spin" /></div>
      ) : selectedKeyword ? (
        <KeywordNetworkGraph data={networkData} onKeywordClick={onKeywordSelect} selectedKeyword={selectedKeyword} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-8 h-8 opacity-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm">Search a keyword to see its relationships</p>
        </div>
      )}
    </div>
  );
}
