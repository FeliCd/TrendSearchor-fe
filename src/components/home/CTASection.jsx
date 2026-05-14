import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="card border-primary-600/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent pointer-events-none" />
          <BookOpen className="w-10 h-10 text-primary-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-[#e6edf3] mb-3">
            Start tracking research trends today
          </h2>
          <p className="text-[#8b949e] text-sm mb-8 max-w-md mx-auto">
            Join researchers and lecturers using TrendScholar to stay on top of the scientific landscape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary">
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              Explore dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
