import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, BarChart, Bar, LabelList,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#1e1e1e] border-2 border-gray-800 rounded-none px-3 py-2.5 shadow-xl backdrop-blur-sm">
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

function ChartStats({ yearlyData, totalPapers, maxPapers, avgPapers, useBar }) {
  const peakYear = yearlyData.find((d) => d.paperCount === maxPapers)?.year;
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
      <span>{yearlyData.length} year{yearlyData.length !== 1 ? 's' : ''} of data</span>
      <span className="text-gray-600">|</span>
      <span>Total: {totalPapers.toLocaleString()} papers</span>
      <span className="text-gray-600">|</span>
      <span>{useBar ? `Peak: ${maxPapers.toLocaleString()} (${peakYear})` : `Avg: ${Math.round(avgPapers).toLocaleString()}/year`}</span>
    </div>
  );
}

const sharedAxisStyle = { tick: { fontSize: 11, fill: '#9ca3af' }, tickLine: false, axisLine: { stroke: '#ffffff15' } };
const sharedYAxis = { ...sharedAxisStyle, tickFormatter: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v, width: 45 };

export default function PublicationTimelineChart({ yearlyData }) {
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
  const chartData = yearlyData.map((item) => ({ year: item.year, Papers: item.paperCount || 0, Citations: item.citationCount || 0 }));
  const avgLine = { y: avgPapers, stroke: '#0058be', strokeDasharray: '4 4', strokeOpacity: 0.5, label: { value: `Avg: ${Math.round(avgPapers).toLocaleString()}`, position: 'insideTopRight', fontSize: 10, fill: '#6b7280' } };

  if (useBar) {
    return (
      <div className="relative">
        <ChartStats yearlyData={yearlyData} totalPapers={totalPapers} maxPapers={maxPapers} avgPapers={avgPapers} useBar />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey="year" {...sharedAxisStyle} />
            <YAxis domain={[0, Math.ceil(maxPapers * 1.3) || 10]} {...sharedYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine {...avgLine} />
            <Bar dataKey="Papers" fill="#0058be" fillOpacity={0.85} radius={[4, 4, 0, 0]}>
              <LabelList dataKey="Papers" position="top" style={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }} formatter={(v) => v > 0 ? v.toLocaleString() : ''} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="relative">
      <ChartStats yearlyData={yearlyData} totalPapers={totalPapers} maxPapers={maxPapers} avgPapers={avgPapers} useBar={false} />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="papersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0058be" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0058be" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis dataKey="year" {...sharedAxisStyle} interval="preserveStartEnd" />
          <YAxis domain={[0, Math.ceil(maxPapers * 1.3) || 10]} {...sharedYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine {...avgLine} />
          <Area type="monotone" dataKey="Papers" stroke="#0058be" strokeWidth={2.5} fill="url(#papersGradient)"
            dot={{ r: 4, fill: '#0058be', strokeWidth: 0, strokeOpacity: 0 }}
            activeDot={{ r: 6, fill: '#0058be', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
