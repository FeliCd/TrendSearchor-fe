import { BookOpen, Users, TrendingUp, Database } from 'lucide-react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  {
    label: 'Research Papers',
    value: '2.4M+',
    numericTarget: 2.4,
    suffix: 'M+',
    icon: BookOpen,
    color: '#4A90E2',
    glow: 'rgba(74,144,226,0.3)',
    bg: 'rgba(74,144,226,0.07)',
  },
  {
    label: 'Active Researchers',
    value: '12K+',
    numericTarget: 12,
    suffix: 'K+',
    icon: Users,
    color: '#246E52',
    glow: 'rgba(36,110,82,0.3)',
    bg: 'rgba(36,110,82,0.07)',
  },
  {
    label: 'Tracked Keywords',
    value: '50K+',
    numericTarget: 50,
    suffix: 'K+',
    icon: TrendingUp,
    color: '#F5A623',
    glow: 'rgba(245,166,35,0.3)',
    bg: 'rgba(245,166,35,0.07)',
  },
  {
    label: 'Data Sources',
    value: '3 APIs',
    numericTarget: 3,
    suffix: ' APIs',
    icon: Database,
    color: '#BD10E0',
    glow: 'rgba(189,16,224,0.3)',
    bg: 'rgba(189,16,224,0.07)',
  },
];

// Animated counter hook
function useCounter(target, inView, decimals = 0) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(parseFloat(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, target, decimals]);

  return val;
}

function StatCard({ stat, index, isInView }) {
  const { label, numericTarget, suffix, icon: Icon, color, glow, bg } = stat;
  const isDecimal = numericTarget % 1 !== 0;
  const count = useCounter(numericTarget, isInView, isDecimal ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  return (
      <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.94 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl
        cursor-default border transition-all duration-300"
          style={{
            background: hovered ? bg : 'transparent',
            borderColor: hovered ? `${color}30` : 'rgba(255,255,255,0.05)',
            boxShadow: hovered ? `0 0 32px ${glow}, inset 0 1px 0 rgba(255,255,255,0.05)` : 'none',
          }}
      >
        {/* Icon with glow ring */}
        <motion.div
            className="relative flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ background: bg, border: `1px solid ${color}30` }}
            animate={hovered ? { scale: 1.1, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.45 }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
          <motion.div
              className="absolute inset-0 rounded-xl"
              animate={hovered ? { boxShadow: `0 0 20px ${glow}` } : { boxShadow: 'none' }}
              transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Animated number */}
        <div className="flex flex-col items-center gap-0.5">
          <motion.span
              className="font-display font-black text-3xl"
              style={{ color: hovered ? color : '#e6edf3', transition: 'color 0.3s' }}
          >
            {count}
            {suffix}
          </motion.span>
          <span className="text-xs text-[#8b949e] font-medium tracking-wide uppercase">
          {label}
        </span>
        </div>

        {/* Hover accent line */}
        <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            animate={hovered ? { width: '70%', opacity: 1 } : { width: '0%', opacity: 0 }}
            transition={{ duration: 0.35 }}
        />
      </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
      <section ref={ref} className="py-14 relative">
        {/* Top / bottom borders with gradient fade */}
        <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                  'linear-gradient(90deg, transparent 0%, rgba(74,144,226,0.2) 30%, rgba(36,110,82,0.2) 70%, transparent 100%)',
            }}
        />
        <div
            className="absolute bottom-0 inset-x-0 h-px"
            style={{
              background:
                  'linear-gradient(90deg, transparent 0%, rgba(74,144,226,0.1) 50%, transparent 100%)',
            }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </section>
  );
}