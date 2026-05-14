import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Logo from '@/components/layout/Logo';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#246E52]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#4A90E2]/5 blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#161b22] border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/30">
            {title && (
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                {subtitle && <p className="text-sm text-[#8b949e] leading-relaxed">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>

          {footerText && (
            <p className="text-center text-sm text-[#8b949e] mt-6">
              {footerText}{' '}
              <Link
                to={footerLinkTo}
                className="font-semibold text-[#4A90E2] hover:text-[#6ba3e0] transition-colors
                  inline-flex items-center gap-1 group"
              >
                {footerLinkText}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-white/[0.06] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo showText={true} className="h-7 w-auto" />
            <span className="text-xs text-[#8b949e]">
              © {new Date().getFullYear()} TrendSearchor. All rights reserved.
            </span>
          </div>
          <div className="text-xs text-[#8b949e]">
            Data powered by Semantic Scholar · OpenAlex · Crossref
          </div>
        </div>
      </footer>
    </div>
  );
}
