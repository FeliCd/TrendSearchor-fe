import { TrendingUp } from 'lucide-react';

export default function AdminTrendsPage() {
  return (
    <div className="min-h-screen bg-[#010409]">
      <div className="border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-white">Trends & Analytics</h1>
          <p className="text-sm text-[#8b949e] mt-0.5">Monitor platform trends and user analytics.</p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#4A90E2]/10 border border-[#4A90E2]/20 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-[#4A90E2]" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Trends & Analytics</h2>
        <p className="text-sm text-[#8b949e] text-center max-w-sm">Detailed analytics dashboard with charts and data visualization coming soon.</p>
      </div>
    </div>
  );
}
