import { motion } from 'framer-motion';

export default function StatsMarqueeSection({ scrollContainer, data }) {
    return (
        <section className="h-screen w-screen sm:w-[85vw] lg:w-[75vw] shrink-0 bg-transparent p-6 lg:p-12 flex flex-col justify-center">
            {/* The Grid Container - Full height of the padding area */}
            <div className="h-full w-full grid grid-cols-4 grid-rows-3 gap-0 border-4 border-[#333] shadow-[16px_16px_0px_0px_#333]">
                
                {/* 1. Large Top-Left Stat (Row 1-2, Col 1-2) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="col-start-1 col-end-3 row-start-1 row-end-3 bg-[#ff86c8] border-r-4 border-b-4 border-[#333] p-8 lg:p-12 flex flex-col justify-end group overflow-hidden relative"
                >
                    <div className="absolute top-12 right-12 w-32 h-32 border-8 border-black rounded-full opacity-20 group-hover:scale-[2] transition-transform duration-700" />
                    <span className="font-black text-6xl lg:text-9xl text-black tracking-tighter relative z-10 transition-transform group-hover:-translate-y-2">{data.stat1.value}</span>
                    <span className="font-black text-lg lg:text-2xl uppercase tracking-widest text-black relative z-10 mt-2">{data.stat1.label}</span>
                </motion.div>

                {/* 2. Top-Right Image (Row 1, Col 3-5) */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="col-start-3 col-end-5 row-start-1 row-end-2 border-b-4 border-[#333] relative overflow-hidden group"
                >
                    <img src="/images/grid2.png" alt="Research" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-[#7bf5ea] mix-blend-multiply opacity-80 group-hover:opacity-0 transition-opacity duration-500" />
                </motion.div>

                {/* 3. Middle Stat (Row 2-3, Col 3-4) */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="col-start-3 col-end-4 row-start-2 row-end-4 bg-[#5b58ff] border-r-4 border-[#333] p-6 lg:p-10 flex flex-col justify-end group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="font-black text-5xl lg:text-7xl text-white tracking-tighter relative z-10">{data.stat2.value}</span>
                    <span className="font-bold text-sm lg:text-base uppercase tracking-widest text-white mt-2 relative z-10">{data.stat2.rawLabelPart1}<br/>{data.stat2.rawLabelPart2}</span>
                </motion.div>

                {/* 4. Small Right Stat (Row 2, Col 4) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="col-start-4 col-end-5 row-start-2 row-end-3 bg-[#0e77ff] border-b-4 border-[#333] p-4 lg:p-8 flex flex-col justify-center items-center text-center group"
                >
                    <span className="font-black text-4xl lg:text-5xl text-white tracking-tighter group-hover:scale-110 transition-transform">{data.stat3.value}</span>
                    <span className="font-bold text-xs lg:text-sm uppercase tracking-widest text-white mt-2">{data.stat3.label}</span>
                </motion.div>

                {/* 5. Bottom Left Image (Row 3, Col 1-2) */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="col-start-1 col-end-2 row-start-3 row-end-4 border-r-4 border-[#333] relative overflow-hidden group"
                >
                    <img src="/images/grid3.png" alt="Data" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-[#ff86c8] mix-blend-multiply opacity-80 group-hover:opacity-0 transition-opacity duration-500" />
                </motion.div>

                {/* 6. Bottom Stat (Row 3, Col 2-3) */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="col-start-2 col-end-3 row-start-3 row-end-4 bg-[#7bf5ea] border-r-4 border-[#333] p-6 lg:p-10 flex flex-col justify-end group"
                >
                    <span className="font-black text-5xl lg:text-6xl text-black tracking-tighter group-hover:translate-x-2 transition-transform">{data.stat4.value}</span>
                    <span className="font-bold text-xs lg:text-sm uppercase tracking-widest text-black mt-2">{data.stat4.rawLabelPart1}<br/>{data.stat4.rawLabelPart2}</span>
                </motion.div>

                {/* 7. Bottom Right Graphic (Row 3, Col 4) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ root: scrollContainer, once: false, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="col-start-4 col-end-5 row-start-3 row-end-4 bg-[#111111] flex items-center justify-center p-8 lg:p-12 group overflow-hidden relative"
                >
                     <div className="w-full aspect-square border-8 border-[#333] rounded-full animate-spin group-hover:border-[#ff86c8] transition-colors duration-500" style={{ animationDuration: '8s' }} >
                        <div className="w-1/2 h-full bg-[#333] group-hover:bg-[#7bf5ea] rounded-l-full transition-colors duration-500" />
                     </div>
                </motion.div>

            </div>
        </section>
    );
}
