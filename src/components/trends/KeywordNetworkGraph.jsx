import { useMemo } from 'react';

function KeywordNode({ node, onKeywordClick, selectedKeyword }) {
  const isSelected = selectedKeyword === node.keyword;
  const baseSize = 20 + Math.min((node.cooccurrenceCount || 1) * 3, 30);
  const size = node.isHub ? baseSize + 20 : baseSize;

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onKeywordClick && onKeywordClick(node.keyword)}
    >
      <div
        className={`
          rounded-full flex items-center justify-center transition-all duration-300
          ${isSelected
            ? 'bg-blue-500/30 border-2 border-blue-400 shadow-lg shadow-blue-500/20'
            : 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40'}
        `}
        style={{ width: size, height: size }}
        title={`${node.keyword} (${node.cooccurrenceCount || 0} co-occurrences)`}
      >
        <span
          className={`text-[10px] font-bold text-center px-1 leading-tight
            ${isSelected ? 'text-blue-300' : 'text-gray-300'}
            group-hover:text-white transition-colors`}
        >
          {node.keyword.length > 8 ? node.keyword.substring(0, 8) + '...' : node.keyword}
        </span>
      </div>
      <span className="text-[9px] text-gray-500 mt-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {node.cooccurrenceCount || 0}
      </span>
    </div>
  );
}

export default function KeywordNetworkGraph({ data, onKeywordClick, selectedKeyword }) {
  const nodes = useMemo(() => {
    if (!data || !data.relatedKeywords || data.relatedKeywords.length === 0) return [];

    const hubKeyword = data.keyword;
    const related = data.relatedKeywords;

    const result = [{
      keyword: hubKeyword,
      cooccurrenceCount: data.totalPapers || 0,
      isHub: true,
      x: 50,
      y: 50,
    }];

    const count = related.length;
    const radius = 38;
    const centerX = 50;
    const centerY = 50;

    related.forEach((item, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      result.push({
        keyword: item.keyword,
        cooccurrenceCount: item.cooccurrenceCount,
        isHub: false,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        relevance: item.relevance,
      });
    });

    return result;
  }, [data, selectedKeyword]);

  const edges = useMemo(() => {
    if (nodes.length < 2) return [];
    const hub = nodes.find(n => n.isHub);
    if (!hub) return [];

    return nodes.filter(n => !n.isHub).map(node => {
      const maxCount = Math.max(...nodes.filter(n => !n.isHub).map(n => n.cooccurrenceCount || 1));
      const width = 1 + ((node.cooccurrenceCount || 1) / maxCount) * 2;
      return {
        x1: hub.x,
        y1: hub.y,
        x2: node.x,
        y2: node.y,
        width,
        opacity: 0.1 + ((node.relevance || 0.3) * 0.5),
      };
    });
  }, [nodes]);

  if (!data || !data.relatedKeywords || data.relatedKeywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        Search for a keyword to see related topics
      </div>
    );
  }

  return (
    <div className="relative">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {edges.map((edge, i) => (
          <line
            key={i}
            x1={`${edge.x1}%`}
            y1={`${edge.y1}%`}
            x2={`${edge.x2}%`}
            y2={`${edge.y2}%`}
            stroke="#4A90E2"
            strokeWidth={edge.width}
            strokeOpacity={edge.opacity}
          />
        ))}
      </svg>

      <div className="relative h-64">
        {nodes.map((node) => (
          <KeywordNode
            key={node.keyword}
            node={node}
            onKeywordClick={onKeywordClick}
            selectedKeyword={selectedKeyword}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 justify-center">
        <span>Click a node to explore that keyword</span>
      </div>
    </div>
  );
}
