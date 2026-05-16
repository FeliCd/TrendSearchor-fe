import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  BarChart,
  Bar,
  LabelList,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#161b22]/95 border border-white/10 rounded-xl px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-semibold text-white mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.value != null ? entry.value.toLocaleString() : 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicationTimelineChart({ yearlyData, keyword }) {
  if (!yearlyData || yearlyData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-sm text-gray-500 gap-2">
        <BarChart className="opacity-20" size={48} />
        <span>No publication data available</span>
      </div>
    );
  }

  const maxPapers = yearlyData.reduce((max, d) => Math.max(max, d.paperCount || 0), 0);
  const totalPapers = yearlyData.reduce((sum, d) => sum + (d.paperCount || 0), 0);
  const avgPapers = yearlyData.length > 0 ? totalPapers / yearlyData.length : 0;

  const useBar = yearlyData.length <= 8 && maxPapers < 200;

  const chartData = yearlyData.map((item) => ({
    year: item.year,
    Papers: item.paperCount || 0,
    Citations: item.citationCount || 0,
    hasData: (item.paperCount || 0) > 0,
  }));

  if (useBar) {
    const domainMax = Math.ceil(maxPapers * 1.3);
    return (
      <div className="relative">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span>{yearlyData.length} year{yearlyData.length !== 1 ? 's' : ''} of data</span>
          <span className="text-gray-600">|</span>
          <span>Total: {totalPapers.toLocaleString()} papers</span>
          <span className="text-gray-600">|</span>
          <span>Peak: {maxPapers.toLocaleString()} ({yearlyData.find(d => d.paperCount === maxPapers)?.year})</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#ffffff15' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              domain={[0, domainMax || 10]}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgPapers}
              stroke="#4A90E2"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: `Avg: ${Math.round(avgPapers).toLocaleString()}`,
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#6b7280',
              }}
            />
            <Bar
              dataKey="Papers"
              fill="#4A90E2"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="Papers"
                position="top"
                style={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
                formatter={(v) => v > 0 ? v.toLocaleString() : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const domainMax = Math.ceil(maxPapers * 1.3);

  return (
    <div className="relative">
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span>{yearlyData.length} years of data</span>
        <span className="text-gray-600">|</span>
        <span>Total: {totalPapers.toLocaleString()} papers</span>
        <span className="text-gray-600">|</span>
        <span>Avg: {Math.round(avgPapers).toLocaleString()}/year</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="papersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={{ stroke: '#ffffff15' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            domain={[0, domainMax || 10]}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgPapers}
            stroke="#4A90E2"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: `Avg: ${Math.round(avgPapers).toLocaleString()}`,
              position: 'insideTopRight',
              fontSize: 10,
              fill: '#6b7280',
            }}
          />
          <Area
            type="monotone"
            dataKey="Papers"
            stroke="#4A90E2"
            strokeWidth={2.5}
            fill="url(#papersGradient)"
            dot={{ r: 4, fill: '#4A90E2', strokeWidth: 0, strokeOpacity: 0 }}
            activeDot={{ r: 6, fill: '#4A90E2', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function YoYGrowthChart({ yearlyData }) {
  if (!yearlyData || yearlyData.length === 0) return null;

  const sortedData = [...yearlyData]
    .filter((d) => d.yoyGrowth != null && (d.paperCount || 0) > 0)
    .sort((a, b) => (a.year || 0) - (b.year || 0));

  if (sortedData.length === 0) return null;

  const chartData = sortedData.map((item) => ({
    year: item.year,
    Growth: Math.round((item.yoyGrowth || 0) * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="yoyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={{ stroke: '#ffffff15' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
          domain={['auto', 'auto']}
          width={40}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, 'YoY Growth']}
          contentStyle={{
            background: '#161b22',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'white',
          }}
        />
        <ReferenceLine y={0} stroke="#ffffff20" />
        <Area
          type="monotone"
          dataKey="Growth"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#yoyGradient)"
          dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
