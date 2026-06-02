import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.2, duration: 0.8 } }
};

export default function CTASection({ scrollContainer, data }) {
    const { scrollXProgress } = useScroll({ container: scrollContainer });
    
    // Parallax values for abstract floating background shapes (not cartoonish icons)
    const y1 = useTransform(scrollXProgress, [0.6, 1], [0, -100]);
    const y2 = useTransform(scrollXProgress, [0.6, 1], [0, 100]);
    
    // Fade out before footer appears
    const opacityFade = useTransform(scrollXProgress, [0.65, 0.8], [1, 0]);

    return (
        <section className="h-screen w-screen shrink-0 py-32 px-8 overflow-hidden bg-[#151515] flex flex-col justify-center relative">
            
            {/* Subtle Abstract Background Shapes */}
            <motion.div style={{ y: y1, opacity: opacityFade }} className="absolute top-20 left-20 w-64 h-64 bg-[#5b58ff] rounded-full mix-blend-screen blur-[100px] opacity-20 pointer-events-none" />
            <motion.div style={{ y: y2, opacity: opacityFade }} className="absolute bottom-20 right-20 w-80 h-80 bg-[#ff86c8] rounded-full mix-blend-screen blur-[120px] opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 w-full px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ root: scrollContainer, once: false, amount: 0.4 }}
                    style={{ opacity: opacityFade }}
                    className="relative bg-[#1e1e1e] p-10 lg:p-16 border-2 border-[#333333] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 overflow-hidden"
                >
                    {/* Abstract diagonal line inside container for tech vibe */}
                    <div className="absolute -top-32 -right-32 w-64 h-96 bg-[#252525] transform rotate-45 pointer-events-none" />

                    {/* Left Side: Content */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-block text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-[#5b58ff] text-white">
                                {data.badge}
                            </span>
                        </motion.div>
                        
                        <motion.p variants={itemVariants} className="text-gray-400 text-base sm:text-lg font-medium max-w-xl leading-relaxed">
                            {data.description}
                        </motion.p>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex flex-col items-center lg:items-start w-full lg:w-auto shrink-0 relative z-10">
                        <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full">
                            {/* Primary CTA */}
                            <Link
                                to={data.primaryAction.to}
                                className="group flex items-center justify-center gap-3 w-full px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all duration-300"
                            >
                                {data.primaryAction.text}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                to={data.secondaryAction.to}
                                className="group flex items-center justify-center gap-2 w-full px-8 py-4 bg-[#151515] border-2 border-[#333333] text-white font-bold uppercase tracking-widest text-sm hover:border-gray-600 hover:bg-[#252525] transition-all duration-300"
                            >
                                <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                {data.secondaryAction.text}
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 w-full">
                            {data.trustBadges.map((t, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5b58ff]" />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}