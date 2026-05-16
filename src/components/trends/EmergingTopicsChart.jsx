import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

const STATUS_COLORS = {
  EMERGING: '#10b981',
  HOT: '#ef4444',
  STABLE: '#3b82f6',
  MATURE: '#a855f7',
  DECLINING: '#6b7280',
};

const QUADRANT_LABELS = [
  { x: 80, y: 20, label: 'Hot', color: '#ef4444' },
  { x: 20, y: 20, label: 'Emerging', color: '#10b981' },
  { x: 80, y: 70, label: 'Mature', color: '#a855f7' },
  { x: 20, y: 70, label: 'Declining', color: '#6b7280' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-[#161b22]/95 border border-white/10 rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-white mb-1">{data.displayName || data.keyword}</p>
      <div className="space-y-0.5 text-xs text-gray-400">
        <p>Growth: <span className={data.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          {data.growthRate != null ? `${Math.round(data.growthRate * 100)}%` : '—'}
        </span></p>
        <p>Papers: <span className="text-gray-300">{data.recentPapers?.toLocaleString() || data.totalPapers?.toLocaleString() || 0}</span></p>
        <p>Status: <span style={{ color: STATUS_COLORS[data.status] || '#6b7280' }}>
          {data.statusLabel || data.status}
        </span></p>
      </div>
    </div>
  );
}

export default function EmergingTopicsChart({ topics }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        No emerging topics data available
      </div>
    );
  }

  const chartData = topics.map(t => ({
    ...t,
    x: Math.min(Math.abs((t.growthRate || 0) * 100) + 10, 95),
    y: Math.min(Math.log1p(t.recentPapers || t.totalPapers || 0) * 15, 90),
    r: Math.sqrt(t.totalCitations || 1) * 0.5 + 8,
    color: STATUS_COLORS[t.status] || '#6b7280',
  }));

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {QUADRANT_LABELS.map((q, i) => (
          <div
            key={i}
            className="absolute text-[10px] font-medium uppercase tracking-wider opacity-30"
            style={{ right: `${100 - q.x}%`, top: `${q.y}%` }}
          >
            <span style={{ color: q.color }}>{q.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis
            type="number"
            dataKey="x"
            name="Growth Rate"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#ffffff10' }}
            label={{ value: 'Growth Rate (%)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#6b7280' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Volume"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#ffffff10' }}
            label={{ value: 'Volume', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }}
          />
          <ReferenceLine x={50} stroke="#ffffff10" />
          <ReferenceLine y={50} stroke="#ffffff10" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                fillOpacity={0.7}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-2 justify-center">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-500">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
