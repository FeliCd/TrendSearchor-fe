import { Link2, Github, Twitter, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectedAccounts() {
  const { user } = useAuth();
  
  const accounts = [
    { id: 'google', name: 'Google', icon: Mail, connected: true, detail: user?.mail || 'admin@mail.com', color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'github', name: 'GitHub', icon: Github, connected: false, color: 'text-gray-400', bg: 'bg-gray-500/10' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, connected: false, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Link2 className="w-5 h-5 text-[#0058be]" />
        Connected Accounts
      </h2>
      
      <div className="space-y-4 flex-1">
        {accounts.map(acc => (
          <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-[var(--dark-bg-base)] hover:border-gray-700 transition-all group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${acc.bg}`}>
                <acc.icon className={`w-5 h-5 ${acc.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{acc.name}</p>
                {acc.connected && acc.detail && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{acc.detail}</p>
                )}
              </div>
            </div>
            
            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              acc.connected 
                ? 'bg-[var(--dark-bg-base)] border border-gray-800 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                : 'bg-[#0058be]/10 text-[#0058be] hover:bg-[#0058be] hover:text-white'
            }`}>
              {acc.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
