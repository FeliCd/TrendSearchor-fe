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
          <div key={acc.id} className="flex items-center justify-between p-4 border-2 border-gray-800 bg-[#1e1e1e] hover:border-gray-700 transition-all group">
            <div className="flex items-center gap-3">
              <div className={`p-2 border-2 border-transparent ${acc.bg}`}>
                <acc.icon className={`w-5 h-5 ${acc.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{acc.name}</p>
                {acc.connected && acc.detail && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{acc.detail}</p>
                )}
              </div>
            </div>
            
            <button className={`w-[110px] flex items-center justify-center px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              acc.connected 
                ? 'bg-[#151515] border-gray-800 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                : 'bg-[#0058be]/10 border-[#0058be]/30 text-[#0058be] hover:bg-[#0058be] hover:text-white hover:border-[#0058be]'
            }`}>
              {acc.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
