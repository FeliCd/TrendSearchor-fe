import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSearchBar from './HeroSearchBar';
import TrendingKeywords from './TrendingKeywords';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#246E52]/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#4A90E2]/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-[#161b22] border border-white/10 text-[#8b949e] text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#4A90E2]" />
          <span>Powered by Semantic Scholar · OpenAlex · Crossref</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="font-display font-extrabold text-4xl sm:text-5xl
          md:text-6xl leading-tight tracking-tight text-[#e6edf3] mb-6">
          Track the pulse of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#246E52]">
            scientific research
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-[#8b949e] text-lg leading-relaxed
          max-w-2xl mx-auto mb-10">
          Discover emerging research trends, track publication patterns across journals,
          and stay ahead in your field — all in one intelligent dashboard.
        </motion.p>

        <motion.div {...fadeUp(0.3)}>
          <HeroSearchBar />
        </motion.div>

        <motion.div {...fadeUp(0.4)}>
          <TrendingKeywords />
        </motion.div>

        <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row items-center
          justify-center gap-3 mt-8">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
              text-white bg-[#246E52] hover:bg-[#1e5943] transition-colors
              shadow-lg shadow-emerald-500/20"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
              text-[#8b949e] bg-[#161b22] border border-white/10 hover:border-white/20
              hover:text-white transition-all"
          >
            Explore Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
