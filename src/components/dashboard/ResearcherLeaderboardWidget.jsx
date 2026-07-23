import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, User, BookOpen, Loader2 } from 'lucide-react';
import { leaderboardService } from '@/services/leaderboardService';
import SectionCard from '@/components/ui/SectionCard';

export default function ResearcherLeaderboardWidget() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await leaderboardService.getLeaderboard(5);
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]/10" />;
      case 2:
        return <Medal className="w-5 h-5 text-[#94a3b8] fill-[#94a3b8]/10" />;
      case 3:
        return <Medal className="w-5 h-5 text-[#b45309] fill-[#b45309]/10" />;
      default:
        return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'border-[#fbbf24]/30 bg-[#fbbf24]/5 hover:border-[#fbbf24]/60';
      case 2:
        return 'border-[#94a3b8]/30 bg-[#94a3b8]/5 hover:border-[#94a3b8]/60';
      case 3:
        return 'border-[#b45309]/30 bg-[#b45309]/5 hover:border-[#b45309]/60';
      default:
        return 'border-gray-800 bg-[#1e1e1e]/40 hover:border-gray-700';
    }
  };

  return (
    <SectionCard title="Honored Researchers" description="Top contributors with the most approved research uploads">
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#0058be] animate-spin" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 text-center py-6">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center py-6">
            No contributor data yet
          </p>
        ) : (
          leaderboard.map((item, index) => {
            const rank = index + 1;
            return (
              <div
                key={item.mail}
                onClick={() => navigate(`/researcher/search?q=${encodeURIComponent(item.fullName || item.mail)}`)}
                className={`flex items-center justify-between p-3.5 border-2 transition-all cursor-pointer ${getRankBg(
                  rank
                )}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-none border border-gray-800 bg-[#151515] shrink-0 font-black text-xs text-white">
                    {rank}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">
                        {item.fullName || 'Anonymous Researcher'}
                      </span>
                      {getRankIcon(rank)}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 block mt-0.5 truncate">
                      {item.mail}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2 bg-[#151515] border border-gray-800 px-3 py-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#0058be]" />
                  <div>
                    <span className="text-sm font-black text-white">{item.approvedPapersCount}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 ml-1">Pubs</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
}
