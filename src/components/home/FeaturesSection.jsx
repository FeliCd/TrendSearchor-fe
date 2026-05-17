import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { BarChart3, Bell, Bookmark, GitCompare, Search, Shield } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Trend Visualization',
    description:
        'Interactive charts showing publication volume for any keyword across years. Compare multiple topics side-by-side.',
    color: '#4A90E2',
    bg: 'rgba(74,144,226,0.07)',
    glow: 'rgba(74,144,226,0.25)',
  },
  {
    icon: Search,
    title: 'Smart Paper Search',
    description:
        'Search by keyword, author, or journal with multi-condition filtering. Sort by relevance, year, or citation count.',
    color: '#246E52',
    bg: 'rgba(36,110,82,0.07)',
    glow: 'rgba(36,110,82,0.25)',
  },
  {
    icon: GitCompare,
    title: 'Keyword Comparison',
    description:
        'Compare growth trajectories of multiple research topics on the same chart to identify dominant and emerging themes.',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.07)',
    glow: 'rgba(245,166,35,0.25)',
  },
  {
    icon: Bell,
    title: 'Follow & Notify',
    description:
        'Follow journals and topics. Get notified when new papers matching your interests are published.',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.07)',
    glow: 'rgba(249,115,22,0.25)',
  },
  {
    icon: Bookmark,
    title: 'Personal Bookmarks',
    description:
        'Save papers and keywords with personal notes. Organize your reference list and revisit them anytime.',
    color: '#BD10E0',
    bg: 'rgba(189,16,224,0.07)',
    glow: 'rgba(189,16,224,0.25)',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description:
        'Researcher, Lecturer/Student, and Admin roles. Advanced analytics unlocked for Researchers.',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.07)',
    glow: 'rgba(6,182,212,0.25)',
  },
];

// 3-D tilt card
function TiltCard({ feature, delay }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [8, -8]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-60, 60], [-8, 8]), { stiffness: 200, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const { icon: Icon, title, description, color, bg, glow } = feature;

  return (
      <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y: 32, scale: 0.94 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 800,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl p-6 border cursor-default transition-colors duration-300 overflow-hidden group"
          animate={{
            borderColor: hovered ? `${color}30` : 'rgba(255,255,255,0.06)',
            background: hovered ? bg : '#161b22',
            boxShadow: hovered
                ? `0 0 40px ${glow}, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
                : '0 2px 8px rgba(0,0,0,0.2)',
          }}
          transition={{ duration: 0.35 }}
      >
        {/* Corner accent */}
        <motion.div
            className="absolute top-0 right-0 w-20 h-20 rounded-bl-[40px]"
            style={{ background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
            className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
            style={{ background: bg, border: `1px solid ${color}25` }}
            animate={hovered ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
          {hovered && (
              <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ boxShadow: 'none' }}
                  animate={{ boxShadow: `0 0 16px ${glow}` }}
                  transition={{ duration: 0.3 }}
              />
          )}
        </motion.div>

        <motion.h3
            className="font-semibold text-base mb-2 transition-colors duration-300"
            style={{ color: hovered ? color : '#e6edf3' }}
        >
          {title}
        </motion.h3>
        <p className="text-[#8b949e] text-sm leading-relaxed">{description}</p>

        {/* Bottom gradient line on hover */}
        <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.35 }}
        />
      </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
          >
            <motion.span
                className="inline-block text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4"
                style={{ color: '#4A90E2', background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.2)' }}
            >
              Features
            </motion.span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#e6edf3] mb-4">
              Everything researchers need
            </h2>
            <p className="text-[#8b949e] max-w-xl mx-auto text-sm leading-relaxed">
              From broad trend discovery to deep paper analysis — TrendScholar covers the full
              research intelligence workflow.
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
              ref={ref}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f, i) => (
                <TiltCard key={f.title} feature={f} delay={i * 0.07} />
            ))}
          </motion.div>
        </div>
      </section>
  );
}