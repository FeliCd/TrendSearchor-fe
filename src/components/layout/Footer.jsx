import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#21262d] bg-[#0d1117] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-[#e6edf3]">
              Trend<span className="text-primary-400">Scholar</span>
            </span>
          </div>
          <p className="text-xs text-[#8b949e]">
            © {new Date().getFullYear()} TrendScholar – Scientific Journal Trend Tracking System
          </p>
          <p className="text-xs text-[#8b949e]">
            Data powered by Semantic Scholar · OpenAlex · Crossref
          </p>
        </div>
      </div>
    </footer>
  );
}
