import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import TrendingChartsSection from '@/components/home/TrendingChartsSection';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

function GridBackground() {
    return (
        <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
            {/* Base dark */}
            <div className="absolute inset-0 bg-[#0d1117]" />
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, #4A90E2 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }}
            />
            {/* Ambient glow blobs */}
            <motion.div
                className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(74,144,226,0.12) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
                animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(36,110,82,0.10) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
        </div>
    );
}

// Scroll-progress bar at top
function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, #4A90E2, #246E52)',
            }}
        />
    );
}

export default function HomePage() {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowTopBtn(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="bg-[#0d1117] text-[#e6edf3] relative min-h-screen">
            <GridBackground />
            <ScrollProgressBar />

            <HeroSection />
            <StatsSection />
            <TrendingChartsSection />
            <FeaturesSection />
            <CTASection />

            {/* Divider glow lines between sections */}
            <div className="pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-0 right-0 h-px"
                        style={{
                            top: `${25 * (i + 1)}%`,
                            background:
                                'linear-gradient(90deg, transparent, rgba(74,144,226,0.08), rgba(36,110,82,0.08), transparent)',
                        }}
                    />
                ))}
            </div>

            <AnimatePresence>
                {showTopBtn && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.7, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 24 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.12, y: -3 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full focus:outline-none"
                        style={{
                            background: 'linear-gradient(135deg, #4A90E2, #246E52)',
                            boxShadow: '0 0 24px rgba(74,144,226,0.4), 0 4px 16px rgba(0,0,0,0.4)',
                        }}
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-5 h-5 text-white" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}