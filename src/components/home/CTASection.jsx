import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

// Animated gradient border via conic-gradient rotation
function AnimatedBorderCard({ children }) {
    const [angle] = useState(0);

    return (
        <div className="relative rounded-3xl p-px overflow-hidden">
            {/* Rotating conic border */}
            <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                    background: `conic-gradient(from ${angle}deg at 50% 50%, #0058be, #009668, #BD10E0, #0058be)`,
                    opacity: 0.35,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner card */}
            <div
                className="relative rounded-3xl overflow-hidden shadow-xl"
                style={{ background: '#ffffff' }}
            >
                {children}
            </div>
        </div>
    );
}

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const [primaryHovered, setPrimaryHovered] = useState(false);

    return (
        <section ref={ref} className="py-24 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <AnimatedBorderCard>
                        <div className="relative px-8 py-14 overflow-hidden">
                            {/* Ambient glow */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px]"
                                style={{
                                    background: 'radial-gradient(ellipse, rgba(74,144,226,0.12) 0%, transparent 70%)',
                                    filter: 'blur(30px)',
                                }}
                            />

                            {/* Icon */}
                            <motion.div
                                className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-6"
                                style={{
                                    background: '#e5eeff',
                                    border: '1px solid #cce0ff',
                                }}
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                <BookOpen className="w-8 h-8 text-[#0058be]" />
                                <motion.div
                                    className="absolute inset-0 rounded-2xl"
                                    animate={{ boxShadow: ['0 0 0px rgba(74,144,226,0)', '0 0 24px rgba(74,144,226,0.3)', '0 0 0px rgba(74,144,226,0)'] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30] mb-3">
                                    Start tracking research trends today
                                </h2>
                                <p className="text-[#45464d] text-sm mb-10 max-w-md mx-auto leading-relaxed">
                                    Join researchers and lecturers using TrendSearchor to stay on top of the
                                    scientific landscape.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3"
                            >
                                {/* Primary CTA */}
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onHoverStart={() => setPrimaryHovered(true)}
                                    onHoverEnd={() => setPrimaryHovered(false)}
                                    className="relative overflow-hidden"
                                >
                                    <Link
                                        to="/register"
                                        className="relative flex items-center gap-2 px-8 py-3.5 rounded-xl
                      text-sm font-semibold text-white z-10"
                                        style={{
                                            background: 'linear-gradient(135deg, #0058be 0%, #009668 100%)',
                                            boxShadow: primaryHovered
                                                ? '0 0 32px rgba(0,88,190,0.45), 0 4px 20px rgba(0,0,0,0.1)'
                                                : '0 4px 16px rgba(0,88,190,0.2)',
                                            transition: 'box-shadow 0.35s',
                                        }}
                                    >
                                        {/* Shimmer sweep */}
                                        <motion.div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                                            }}
                                            animate={primaryHovered ? { x: ['−100%', '200%'] } : { x: '-100%' }}
                                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                                        />
                                        <Sparkles className="w-4 h-4" />
                                        Create free account
                                        <motion.div animate={primaryHovered ? { x: 3 } : { x: 0 }} transition={{ duration: 0.2 }}>
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.div>
                                    </Link>
                                </motion.div>

                                {/* Secondary CTA */}
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm
                      font-semibold text-[#45464d] border border-[#c6c6cd]/60
                      hover:border-[#0058be]/30 hover:text-[#0b1c30] hover:bg-[#f8f9ff]
                      transition-all duration-300"
                                    >
                                        Explore dashboard
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="flex items-center justify-center gap-5 mt-10"
                            >
                                {['No credit card', 'Free tier forever', 'Cancel anytime'].map((t, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs text-[#76777d]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#009668]" />
                                        {t}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </AnimatedBorderCard>
                </motion.div>
            </div>
        </section>
    );
}