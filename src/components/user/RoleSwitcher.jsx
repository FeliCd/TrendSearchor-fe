import { useState } from 'react';
import { Shield, Loader2, RefreshCw } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

export default function RoleSwitcher({ onSwitch, onToast }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const roleOptions = [
    { value: ROLES.STUDENT, label: 'Student / Lecturer', description: 'Access academic features for learning and teaching',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> },
    { value: ROLES.RESEARCHER, label: 'Researcher', description: 'Unlock advanced analytics and trend insights',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
  ];

  const handleSwitch = async (role) => {
    if (role === user?.role) return;
    setSaving(true);
    try { await profileService.changeRole(role); onSwitch(role); }
    catch (err) { onToast(err?.response?.data?.role || err?.response?.data?.message || 'Failed to change role', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#c6c6cd]/40">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#0058be]" />
          <p className="text-sm font-bold text-[#0b1c30]">Switch Account Type</p>
        </div>
        <p className="text-xs text-[#76777d]">Choose between Student/Lecturer or Researcher to access different features.</p>
      </div>
      <div className="space-y-3">
        {roleOptions.map((opt) => {
          const isCurrent = user?.role === opt.value;
          return (
            <button key={opt.value} onClick={() => handleSwitch(opt.value)} disabled={saving || isCurrent}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                isCurrent ? 'border-[#0058be]/40 bg-[#0058be]/5 cursor-default' : 'border-[#c6c6cd]/40 bg-white hover:border-[#0058be]/40 hover:bg-[#f8f9ff]'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCurrent ? 'bg-[#0058be]/10 text-[#0058be]' : 'bg-[#f8f9ff] text-[#76777d] border border-[#c6c6cd]/40'}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${isCurrent ? 'text-[#0058be]' : 'text-[#0b1c30]'}`}>{opt.label}</p>
                      {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0058be]/10 text-[#0058be] font-bold uppercase tracking-wider">Current</span>}
                    </div>
                    <p className="text-xs text-[#76777d] mt-0.5">{opt.description}</p>
                  </div>
                </div>
                {!isCurrent && (saving ? <Loader2 className="w-4 h-4 text-[#0058be] animate-spin" /> : <RefreshCw className="w-4 h-4 text-[#0058be]" />)}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[#76777d] text-center">Switching account type will redirect you to the corresponding dashboard.</p>
    </div>
  );
}
