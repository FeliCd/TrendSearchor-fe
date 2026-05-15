import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-[#010409]">
      <div className="border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-[#8b949e] mt-0.5">Manage platform configuration and preferences.</p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-white/40" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Settings</h2>
        <p className="text-sm text-[#8b949e] text-center max-w-sm">Platform configuration and system preferences coming soon.</p>
      </div>
    </div>
  );
}
