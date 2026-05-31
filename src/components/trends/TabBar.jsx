import { BarChart2, GitCompare, Network, Zap } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'trending', label: 'Trending', icon: Zap },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'network', label: 'Network', icon: Network },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#0d1117] rounded-xl border border-white/5 w-fit">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-[#4A90E2] text-white shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}>
            <Icon className="w-3.5 h-3.5" />{tab.label}
          </button>
        );
      })}
    </div>
  );
}
