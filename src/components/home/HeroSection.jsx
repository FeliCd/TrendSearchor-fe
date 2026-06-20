import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSearchBar from './HeroSearchBar';
import Logo from '@/components/layout/Logo';

export default function HeroSection({ scrollContainer, data }) {
  const { scrollXProgress } = useScroll({ container: scrollContainer });
  const opacity = useTransform(scrollXProgress, [0, 0.3], [1, 0]);
  const x = useTransform(scrollXProgress, [0, 0.3], [0, -100]);

  return (
    <section className="relative h-screen w-screen shrink-0 flex flex-col lg:flex-row bg-transparent overflow-hidden">
      {/* LEFT COLUMN - DARK */}
      <motion.div 
        style={{ opacity, x }}
        className="w-full lg:w-1/2 flex flex-col relative z-10 px-8 py-6 lg:px-16 lg:py-10 h-screen overflow-y-auto hide-scrollbar"
      >
        
        {/* Custom Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-20 w-full shrink-0 relative z-10">
          <Link to="/">
            <Logo variant="navbar" />
          </Link>
          
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-white/80">
            {data.navigation.map((nav, i) => (
              <Link key={i} to={nav.to} className="hover:text-white transition-colors uppercase tracking-widest">{nav.label}</Link>
            ))}
            <Link to="/login" className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#5b58ff] transition-all">
              Login
            </Link>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[#5b58ff] text-sm font-semibold mb-4 tracking-wider"
          >
            {data.subTitle}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-[72px] leading-[1.05] font-bold text-white tracking-tight mb-10"
            style={{ fontFamily: "'M PLUS U', sans-serif" }}
          >
            {data.titleLine1}<br />{data.titleLine2}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <HeroSearchBar />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 bg-[#5b58ff] p-6 inline-block self-start shadow-xl"
          >
            <p className="text-white text-xs font-bold uppercase tracking-widest leading-relaxed">
              {data.highlightBadge.line1}<br />{data.highlightBadge.line2}
            </p>
            <div className="w-10 h-0.5 bg-white mt-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT COLUMN - MONDRIAN GRID */}
      <div className="w-full lg:w-1/2 h-screen relative bg-white hidden lg:block border-l-4 border-black">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-0">
          
          {/* ROW 1 */}
          <div className="bg-[#7bf5ea] col-start-1 col-end-2 row-start-1 row-end-2 border-r-4 border-b-4 border-black"></div>
          <div className="bg-[#f4f4f5] col-start-2 col-end-4 row-start-1 row-end-3 relative overflow-hidden flex items-center justify-center border-r-4 border-b-4 border-black">
            <img src="/images/grid1.png" alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#8233ff] col-start-4 col-end-5 row-start-1 row-end-2 border-b-4 border-black"></div>

          {/* ROW 2 */}
          <div className="bg-[#18153a] col-start-1 col-end-2 row-start-2 row-end-3 border-r-4 border-b-4 border-black"></div>
          <div className="bg-[#0e77ff] col-start-4 col-end-5 row-start-2 row-end-3 border-b-4 border-black"></div>

          {/* ROW 3 */}
          <div className="bg-[#1231f4] col-start-1 col-end-2 row-start-3 row-end-5 border-r-4 border-b-4 border-black"></div>
          <div className="bg-white col-start-2 col-end-4 row-start-3 row-end-4 border-r-4 border-b-4 border-black"></div>
          <div className="bg-black col-start-4 col-end-5 row-start-3 row-end-4 relative overflow-hidden flex items-center justify-center border-b-4 border-black">
             <img src="/images/grid3.png" alt="Expert" className="w-full h-full object-cover" />
          </div>

          {/* ROW 4 */}
          <div className="bg-white col-start-2 col-end-4 row-start-4 row-end-6 relative overflow-hidden z-10 border-r-4 border-black flex items-center justify-center shadow-2xl">
            <img src="/images/grid2.png" alt="Mentor" className="w-full h-full object-cover object-top" />
          </div>
          <div className="bg-[#8233ff] col-start-4 col-end-5 row-start-4 row-end-5 border-b-4 border-black"></div>

          {/* ROW 5 */}
          <div className="bg-[#ff86c8] col-start-1 col-end-2 row-start-5 row-end-6 border-r-4 border-black"></div>
          <div className="bg-[#18153a] col-start-4 col-end-5 row-start-5 row-end-6"></div>

        </div>
      </div>
    </section>
  );
}