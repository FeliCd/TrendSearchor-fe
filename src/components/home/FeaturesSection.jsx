import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart3, Bell, Bookmark, GitCompare, Search, Shield } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: BarChart3,
    title: 'Trend Visualization',
    description: 'Interactive line charts showing publication volume for any keyword across years. Compare multiple topics side-by-side.',
    color: 'bg-primary-600/10 text-primary-400 border-primary-600/20',
  },
  {
    icon: Search,
    title: 'Smart Paper Search',
    description: 'Search by keyword, author, or journal with multi-condition filtering. Sort by relevance, year, or citation count.',
    color: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
  },
  {
    icon: GitCompare,
    title: 'Keyword Comparison',
    description: 'Compare the growth trajectory of multiple research topics on the same chart to identify dominant and emerging themes.',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    icon: Bell,
    title: 'Follow & Notify',
    description: 'Follow journals and research topics. Get notified when new papers matching your interests are published.',
    color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    icon: Bookmark,
    title: 'Personal Bookmarks',
    description: 'Save papers and keywords with personal notes. Organize your reference list and revisit them anytime.',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Researcher, Lecturer/Student, and Admin roles. Advanced analytics unlocked for Researchers.',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-bold text-3xl text-[#e6edf3] mb-4">
            Everything researchers need
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm leading-relaxed">
            From broad trend discovery to deep paper analysis — TrendScholar covers the full research intelligence workflow.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((props) => (
            <FeatureCard key={props.title} {...props} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
