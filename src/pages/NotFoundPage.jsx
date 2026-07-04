import { Link } from 'react-router-dom';
import { Home, Search, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#010409] text-white">
      <div className="max-w-md space-y-6">
        <div className="inline-block px-3 py-1 bg-[#0058be]/20 border border-[#0058be] text-[#5ba3ff] text-[11px] font-bold uppercase tracking-widest">
          404 Not Found
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
          <Link
            to="/researcher/search"
            className="px-6 py-3 bg-[#1e1e1e] border border-gray-800 text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Papers
          </Link>
        </div>
      </div>
    </div>
  );
}

