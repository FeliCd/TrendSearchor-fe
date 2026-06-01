import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroSearchBar from './HeroSearchBar';
import TrendingKeywords from './TrendingKeywords';

// ── Typewriter for rotating words ──────────────────────────────────────────
const WORDS = ['scientific research', 'emerging trends', 'your field', 'academia'];

function TypewriterWord() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[index];
    let timeout;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
      <span className="relative">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058be] to-[#009668]">
        {displayed}
      </span>
      <motion.span
          className="inline-block w-[3px] h-[1em] ml-1 align-middle rounded-sm"
          style={{ background: '#0058be', verticalAlign: 'middle' }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
      />
    </span>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection() {
  return (
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
              {...fadeUp(0)}
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-[#f8f9ff] border border-[#0058be]/20 text-[#45464d] text-xs
            font-medium mb-10 cursor-default shadow-sm shadow-[#0058be]/10"
          >
            <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0058be]" />
            </motion.div>
            <span>Powered by Semantic Scholar · OpenAlex · Crossref</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#009668] animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
              {...fadeUp(0.1)}
              className="font-display font-extrabold text-4xl sm:text-5xl
            md:text-[3.75rem] leading-[1.1] tracking-tight text-[#0b1c30] mb-6"
          >
            Track the pulse of{' '}
            <br className="hidden sm:block" />
            <TypewriterWord />
          </motion.h1>

          {/* Sub */}
          <motion.p
              {...fadeUp(0.2)}
              className="text-[#45464d] text-base sm:text-lg leading-relaxed
            max-w-2xl mx-auto mb-10"
          >
            Discover emerging research trends, track publication patterns across journals,
            and stay ahead in your field — all in one intelligent dashboard.
          </motion.p>

          {/* Search */}
          <motion.div {...fadeUp(0.3)}>
            <HeroSearchBar />
          </motion.div>

          <motion.div {...fadeUp(0.38)}>
            <TrendingKeywords />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
              {...fadeUp(0.46)}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                  to="/register"
                  className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl
                text-sm font-semibold text-white overflow-hidden
                shadow-lg shadow-[#009668]/30 hover:shadow-[#009668]/40
                transition-shadow duration-300"
                  style={{ background: 'linear-gradient(135deg, #009668 0%, #007a55 100%)' }}
              >
                {/* Shimmer sweep */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background:
                          'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                    }}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.55 }}
                />
                <Zap className="w-4 h-4" />
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm
                font-semibold text-[#45464d] bg-white border border-[#c6c6cd]/60
                hover:border-[#0058be]/40 hover:text-[#0b1c30] hover:bg-[#f8f9ff]
                transition-all duration-300"
              >
                Explore Dashboard
              </Link>
            </motion.div>
          </motion.div>

          {/* Social proof */}
          <motion.div
              {...fadeUp(0.55)}
              className="flex items-center justify-center gap-3 mt-10 text-xs text-[#76777d]"
          >
            <div className="flex -space-x-1.5">
              {['#0058be', '#009668', '#F5A623', '#BD10E0'].map((c, i) => (
                  <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ background: `${c}33`, boxShadow: `0 0 6px ${c}33` }}
                  />
              ))}
            </div>
            <span>
            Join <strong className="text-[#0b1c30]">12,000+</strong> researchers already using TrendSearchor
          </span>
          </motion.div>
        </div>
      </section>
  );
}