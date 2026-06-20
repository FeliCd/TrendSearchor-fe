import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

function FeatureCard({ feature, delay }) {
  const [hovered, setHovered] = useState(false);
  const { icon: Icon, title, description, color } = feature;

  return (
      <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8, delay: delay }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative rounded-none p-8 border-2 cursor-default overflow-hidden transition-all duration-300 bg-[#1e1e1e]"
          style={{
            borderColor: hovered ? color : '#333333',
            boxShadow: hovered ? `8px 8px 0px 0px ${color}` : '0px 0px 0px 0px transparent',
            transform: hovered ? 'translate(-4px, -4px)' : 'translate(0px, 0px)',
          }}
      >
        {/* Abstract shape */}
        <motion.div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 pointer-events-none"
            style={{ background: color }}
            animate={{ scale: hovered ? 1.5 : 1 }}
            transition={{ duration: 0.4 }}
        />

        {/* Icon */}
        <div 
            className="relative inline-flex items-center justify-center w-12 h-12 mb-6"
            style={{ border: `2px solid ${color}`, background: hovered ? color : 'transparent' }}
        >
          <Icon className="w-5 h-5 transition-colors" style={{ color: hovered ? '#000' : color }} />
        </div>

        <h3 className="font-bold text-lg mb-3 text-white tracking-wide" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed font-medium">{description}</p>
      </motion.div>
  );
}

export default function FeaturesSection({ scrollContainer, data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { root: scrollContainer, once: false, margin: '0px 0px 0px -100px' });
  
  return (
      <section className="h-screen w-screen shrink-0 py-24 px-8 overflow-y-auto hide-scrollbar bg-transparent flex flex-col justify-center relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, x: -200, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 1.5 }}
              className="text-center mb-20"
          >
            <span className="inline-block text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 mb-6 bg-[#5b58ff] text-white">
              {data.header.badge}
            </span>
            <h2 className="font-bold text-4xl md:text-5xl text-white mb-6" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
              {data.header.title}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed font-medium">
              {data.header.description}
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
              ref={ref}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.items.map((f, i) => (
                <FeatureCard key={f.title} feature={f} delay={i * 0.07} />
            ))}
          </motion.div>
        </div>
      </section>
  );
}