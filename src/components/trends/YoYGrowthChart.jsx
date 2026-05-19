import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export default function YoYGrowthChart({ yearlyData }) {
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
