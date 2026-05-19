import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

const MOCK_DATA = [
  { year: '2015', 'Artificial Intelligence': 1200, 'Blockchain': 300, 'Quantum Computing': 400 },
  { year: '2016', 'Artificial Intelligence': 1500, 'Blockchain': 800, 'Quantum Computing': 450 },
  { year: '2017', 'Artificial Intelligence': 2500, 'Blockchain': 2100, 'Quantum Computing': 600 },
  { year: '2018', 'Artificial Intelligence': 3800, 'Blockchain': 3500, 'Quantum Computing': 800 },
  { year: '2019', 'Artificial Intelligence': 5100, 'Blockchain': 2200, 'Quantum Computing': 1100 },
  { year: '2020', 'Artificial Intelligence': 7200, 'Blockchain': 1800, 'Quantum Computing': 1500 },
  { year: '2021', 'Artificial Intelligence': 10500, 'Blockchain': 3100, 'Quantum Computing': 2100 },
  { year: '2022', 'Artificial Intelligence': 14800, 'Blockchain': 2800, 'Quantum Computing': 2800 },
  { year: '2023', 'Artificial Intelligence': 22000, 'Blockchain': 1900, 'Quantum Computing': 3700 },
  { year: '2024', 'Artificial Intelligence': 31500, 'Blockchain': 1600, 'Quantum Computing': 5200 },
];

const TOPICS = [
  { key: 'Artificial Intelligence', color: '#4A90E2', grad: 'colorAI' },
  { key: 'Blockchain', color: '#F5A623', grad: 'colorBlockchain' },
  { key: 'Quantum Computing', color: '#BD10E0', grad: 'colorQuantum' },
];

const DEFS = TOPICS.map(({ key, color, grad }) => (
  <linearGradient key={grad} id={grad} x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
    <stop offset="95%" stopColor={color} stopOpacity={0} />
  </linearGradient>
));

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161b22]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
      <p className="text-white font-semibold mb-2 text-sm">Year: {label}</p>
      <div className="space-y-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#8b949e]">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value.toLocaleString()} papers</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrendingChartsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTopics, setActiveTopics] = useState({
    'Artificial Intelligence': true, 'Blockchain': true, 'Quantum Computing': true,
  });

  const toggleTopic = (topic) => setActiveTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {payload.map((entry) => (
        <button key={entry.value} onClick={() => toggleTopic(entry.value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            activeTopics[entry.value] ? 'bg-white/5 text-white border border-white/10' : 'bg-transparent text-[#8b949e] border border-transparent hover:bg-white/5 opacity-50'
          }`}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTopics[entry.value] ? entry.color : '#4b5563' }} />
          {entry.value}
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 text-[#4A90E2]">
            <ChartIcon className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#e6edf3] mb-4">Discover What's Trending</h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm leading-relaxed">
            Visualize the exponential growth of emerging fields. Compare publication volumes across different disciplines instantly.
          </p>
        </motion.div>
        <motion.div ref={ref} initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-[#161b22]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-8 shadow-2xl">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>{DEFS}</defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="year" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} verticalAlign="bottom" height={60} />
                {TOPICS.filter((t) => activeTopics[t.key]).map((t) => (
                  <Area key={t.key} type="monotone" dataKey={t.key} stroke={t.color} strokeWidth={3}
                    fillOpacity={1} fill={`url(#${t.grad})`}
                    activeDot={{ r: 6, fill: t.color, stroke: '#0d1117', strokeWidth: 2 }} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
