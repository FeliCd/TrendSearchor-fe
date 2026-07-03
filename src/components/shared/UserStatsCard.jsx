import { useState, useEffect } from 'react';
import { Activity, Search, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookmarkService } from '@/services/bookmarkService';
import { recentSearchService } from '@/services/recentSearchService';

export default function UserStatsCard() {
  const [statsData, setStatsData] = useState({
    totalSearches: 0,
    savedItems: 0,
    activityScore: 0,
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [searchesRes, bookmarksRes] = await Promise.allSettled([
          recentSearchService.getRecentSearches({ page: 0, size: 1 }),
          bookmarkService.getBookmarks({ page: 0, size: 1 }),
        ]);

        let totalSearches = 0;
        if (searchesRes.status === 'fulfilled') {
          totalSearches = searchesRes.value?.totalElements || searchesRes.value?.total || searchesRes.value?.length || 0;
        }

        let savedItems = 0;
        if (bookmarksRes.status === 'fulfilled') {
          savedItems = bookmarksRes.value?.totalElements || bookmarksRes.value?.total || bookmarksRes.value?.length || 0;
        }

        // Calculate a dynamic engagement activity score based on real user actions
        const score = Math.min(100, Math.round((totalSearches * 5 + savedItems * 10) / (totalSearches + savedItems + 1) + (totalSearches > 0 ? 50 : 0)));

        setStatsData({
          totalSearches,
          savedItems,
          activityScore: score,
          loading: false,
        });
      } catch (err) {
        console.warn('Failed to load user stats:', err);
        setStatsData({ totalSearches: 0, savedItems: 0, activityScore: 0, loading: false });
      }
    }

    loadStats();
  }, []);

  const stats = [
    { label: 'Total Searches', value: statsData.loading ? '...' : statsData.totalSearches.toLocaleString(), icon: Search, iconColor: 'text-[#0058be]' },
    { label: 'Saved Items', value: statsData.loading ? '...' : statsData.savedItems.toLocaleString(), icon: Bookmark, iconColor: 'text-[#0058be]' },
    { label: 'Activity Score', value: statsData.loading ? '...' : `${statsData.activityScore}%`, icon: Activity, iconColor: 'text-[#0058be]' },
  ];

  return (
    <div className="bg-[#151515] border-2 border-gray-800 shadow-sm p-6 h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative overflow-hidden px-4 py-3.5 border-2 border-gray-800
                hover:border-gray-700 transition-all duration-300 cursor-default bg-[#1e1e1e]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white leading-none tracking-tight">{stat.value}</p>
                </div>
                <div className="mt-0.5 w-8 h-8 border-2 bg-[#151515] border-gray-800 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
