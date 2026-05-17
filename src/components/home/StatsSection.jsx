import { BookOpen, Users, TrendingUp, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { label: 'Research Papers', value: '2.4M+', icon: BookOpen, color: 'text-primary-400' },
  { label: 'Active Researchers', value: '12K+', icon: Users, color: 'text-accent-400' },
  { label: 'Tracked Keywords', value: '50K+', icon: TrendingUp, color: 'text-yellow-400' },
  { label: 'Data Sources', value: '3 APIs', icon: Database, color: 'text-pink-400' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-12 border-y border-[#21262d] bg-[#161b22]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="flex flex-col items-center text-center gap-2"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="font-display font-bold text-2xl text-[#e6edf3]">{value}</span>
              <span className="text-xs text-[#8b949e]">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
