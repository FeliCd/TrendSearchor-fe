import { Monitor, Smartphone, MapPin, Clock, ShieldCheck, LogOut } from 'lucide-react';

export default function RecentDevices() {
  const sessions = [
    { id: 1, device: 'Windows PC - Chrome', location: 'Ho Chi Minh City, VN', time: 'Active now', icon: Monitor, current: true },
    { id: 2, device: 'iPhone 13 Pro - Safari', location: 'Hanoi, VN', time: '2 hours ago', icon: Smartphone, current: false },
    { id: 3, device: 'MacBook Pro - Chrome', location: 'Da Nang, VN', time: 'Yesterday', icon: Monitor, current: false },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0058be]" />
          Recent Devices & Sessions
        </h2>
        <button className="text-[10px] font-black uppercase tracking-widest text-[#0058be] hover:text-white hover:underline transition-colors">
          Sign out all other sessions
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
        {sessions.map(session => (
            <div key={session.id} className="p-4 border-2 border-gray-800 bg-[#1e1e1e] flex flex-col relative group hover:border-gray-700 transition-all">
            {session.current && (
              <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
            
            <div className={`w-10 h-10 border-2 flex items-center justify-center mb-3 ${session.current ? 'border-[#0058be]/30 bg-[#0058be]/10 text-[#0058be]' : 'bg-[#151515] border-gray-800 text-gray-500'}`}>
              <session.icon className="w-5 h-5" />
            </div>
            
            <h3 className="text-sm font-bold text-white mb-1 truncate" title={session.device}>{session.device}</h3>
            
            <div className="mt-auto space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-600" />
                <span className="truncate">{session.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-xs ${session.current ? 'text-emerald-400 font-bold' : 'text-gray-500 font-medium'}`}>
                  <Clock className={`w-3.5 h-3.5 ${session.current ? 'text-emerald-500' : 'text-gray-600'}`} />
                  <span>{session.time}</span>
                </div>
                {!session.current && (
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border-2 border-transparent hover:border-red-500/20" title="Sign out">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
