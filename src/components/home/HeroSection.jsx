import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
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
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#246E52]">
        {displayed}
      </span>
      <motion.span
          className="inline-block w-[3px] h-[1em] ml-1 align-middle rounded-sm"
          style={{ background: '#4A90E2', verticalAlign: 'middle' }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
      />
    </span>
  );
}

// ── Magnetic button wrapper ─────────────────────────────────────────────────
function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
      <motion.div
          ref={ref}
          style={{ x: sx, y: sy }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
          {...props}
      >
        {children}
      </motion.div>
  );
}

// ── Floating particle orbs ──────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 320, x: '60%', y: '-5%', color: 'rgba(74,144,226,0.09)', delay: 0, dur: 14 },
    { size: 240, x: '-5%', y: '30%', color: 'rgba(36,110,82,0.08)', delay: 2, dur: 11 },
    { size: 180, x: '80%', y: '60%', color: 'rgba(189,16,224,0.05)', delay: 4, dur: 16 },
  ];

  return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: orb.x,
                  top: orb.y,
                  background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }}
                animate={{ y: [0, 30, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
        ))}
      </div>
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
        <FloatingOrbs />

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
              {...fadeUp(0)}
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-[#161b22] border border-[#4A90E2]/20 text-[#8b949e] text-xs
            font-medium mb-10 cursor-default shadow-lg shadow-[#4A90E2]/5"
          >
            <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A90E2]" />
            </motion.div>
            <span>Powered by Semantic Scholar · OpenAlex · Crossref</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#246E52] animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
              {...fadeUp(0.1)}
              className="font-display font-extrabold text-4xl sm:text-5xl
            md:text-[3.75rem] leading-[1.1] tracking-tight text-[#e6edf3] mb-6"
          >
            Track the pulse of{' '}
            <br className="hidden sm:block" />
            <TypewriterWord />
          </motion.h1>

          {/* Sub */}
          <motion.p
              {...fadeUp(0.2)}
              className="text-[#8b949e] text-base sm:text-lg leading-relaxed
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
            <MagneticButton>
              <Link
                  to="/register"
                  className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl
                text-sm font-semibold text-white overflow-hidden
                shadow-lg shadow-emerald-900/30 transition-shadow duration-300
                hover:shadow-emerald-700/40"
                  style={{
                    background: 'linear-gradient(135deg, #246E52 0%, #1e5943 100%)',
                  }}
              >
                {/* Shimmer */}
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
            </MagneticButton>

            <MagneticButton>
              <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm
                font-semibold text-[#8b949e] bg-[#161b22] border border-white/10
                hover:border-[#4A90E2]/40 hover:text-[#e6edf3] hover:bg-[#1c2333]
                transition-all duration-300"
              >
                Explore Dashboard
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Social proof */}
          <motion.div
              {...fadeUp(0.55)}
              className="flex items-center justify-center gap-3 mt-10 text-xs text-[#8b949e]"
          >
            <div className="flex -space-x-1.5">
              {['#4A90E2', '#246E52', '#F5A623', '#BD10E0'].map((c, i) => (
                  <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#0d1117]"
                      style={{ background: `${c}33`, borderColor: c, boxShadow: `0 0 6px ${c}55` }}
                  />
              ))}
            </div>
            <span>
            Join <strong className="text-[#e6edf3]">12,000+</strong> researchers already using TrendScholar
          </span>
          </motion.div>
        </div>
      </section>
  );
}