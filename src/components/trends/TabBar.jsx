import { BarChart2, GitCompare, Network, Zap } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'trending', label: 'Trending', icon: Zap },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'network', label: 'Network', icon: Network },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#151515] rounded-none border-2 border-gray-800 w-fit">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-none text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-[#0058be] text-white shadow-sm' : 'text-gray-500 hover:text-white hover:bg-[#1e1e1e]'
            }`}>
            <Icon className="w-3.5 h-3.5" />{tab.label}
          </button>
        );
      })}
    </div>
  );
}
