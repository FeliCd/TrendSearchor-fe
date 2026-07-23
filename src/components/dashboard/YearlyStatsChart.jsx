import SectionCard from '@/components/ui/SectionCard';

export const getYearlyChartLogic = (stats) => {
  const maxCount = Math.max(...(stats.map(s => s.paperCount) || [0]), 10);
  return stats.map(s => ({
    ...s,
    heightPercentage: Math.max((s.paperCount / maxCount) * 100, 5)
  }));
};

export default function YearlyStatsChart({ yearlyStats = [] }) {
  const displayStats = yearlyStats.slice(-10); // Show up to last 10 years

  if (!displayStats || displayStats.length === 0) {
    return (
      <SectionCard title="Yearly Publication Stats">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-sm">No data available yet.</p>
        </div>
      </SectionCard>
    );
  }

  const chartData = getYearlyChartLogic(displayStats);

  return (
    <SectionCard title="Yearly Publication Stats">
      <div className="p-5">
        <div className="flex items-end gap-2 h-40">
          {chartData.map((yearData, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
              {/* Tooltip */}
              <div className="absolute -top-8 bg-[#1e1e1e] border border-gray-700 text-xs text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 shadow-lg">
                {yearData.paperCount?.toLocaleString()} papers
              </div>
              
              {/* Bar */}
              <div 
                className="w-full bg-[#0058be]/20 group-hover:bg-[#0058be]/40 rounded-t transition-all relative" 
                style={{ height: `${yearData.heightPercentage}%` }} 
              />
              
              {/* X-axis Label */}
              <span className="text-[10px] text-gray-500 hidden sm:block">
                {yearData.year}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 sm:hidden">
          <span className="text-[10px] text-gray-500">{chartData[0]?.year}</span>
          <span className="text-[10px] text-gray-500">{chartData[chartData.length - 1]?.year}</span>
        </div>
      </div>
    </SectionCard>
  );
}
