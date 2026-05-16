import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KEYWORD_COLORS = [
  '#4A90E2',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#161b22]/95 border border-white/10 rounded-xl px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-semibold text-white mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopicComparisonChart({ comparison }) {
  if (!comparison || !comparison.yearlyDataMap || comparison.keywords?.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        Search and select keywords to compare
      </div>
    );
  }

  const { yearlyDataMap, keywords } = comparison;

  const allYears = new Set();
  keywords.forEach((kw) => {
    const data = yearlyDataMap[kw.toLowerCase()] || [];
    data.forEach((d) => {
      if (d.year) allYears.add(d.year);
    });
  });

  const sortedYears = [...allYears].sort((a, b) => a - b);

  const chartData = sortedYears.map((year) => {
    const row = { year };
    keywords.forEach((kw) => {
      const data = yearlyDataMap[kw.toLowerCase()] || [];
      const entry = data.find((d) => d.year === year);
      row[kw] = entry?.paperCount || 0;
    });
    return row;
  });

  return (
    <div className="space-y-3">
      {comparison.insight && (
        <div className="bg-[#0d1117] border border-white/10 rounded-xl p-3">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-[#4A90E2] font-medium">AI Insight: </span>
            {comparison.insight}
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#ffffff10' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#6b7280' }}
            iconType="circle"
            iconSize={8}
          />
          {keywords.map((kw, i) => (
            <Line
              key={kw}
              type="monotone"
              dataKey={kw}
              stroke={KEYWORD_COLORS[i % KEYWORD_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: KEYWORD_COLORS[i % KEYWORD_COLORS.length], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2">
        {keywords.map((kw, i) => {
          const data = yearlyDataMap[kw.toLowerCase()] || [];
          const total = data.reduce((s, d) => s + (d.paperCount || 0), 0);
          const latest = data.length > 0 ? data[data.length - 1]?.paperCount || 0 : 0;
          const prev = data.length > 1 ? data[data.length - 2]?.paperCount || 0 : 0;
          const growth = prev > 0 ? ((latest - prev) / prev) * 100 : 0;

          return (
            <div
              key={kw}
              className="bg-[#0d1117] rounded-xl p-3 border border-white/5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: KEYWORD_COLORS[i % KEYWORD_COLORS.length] }}
                />
                <span className="text-xs font-medium text-white truncate">{kw}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-gray-500">
                  {total.toLocaleString()} total
                </span>
                <span className={`flex items-center gap-0.5 ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {growth >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(growth).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
