import { motion } from 'framer-motion';

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card hover:border-[#30363d] transition-all duration-200 group cursor-pointer"
    >
      <div className={`inline-flex p-2.5 rounded-lg border mb-4 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-[#e6edf3] mb-2 text-sm">{title}</h3>
      <p className="text-[#8b949e] text-xs leading-relaxed">{description}</p>
    </motion.div>
  );
}
