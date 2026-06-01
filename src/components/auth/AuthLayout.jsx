import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
  leftPanelContent,
  showSocialButtons = false,
  isWide = false,
}) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0b1c30] p-6 overflow-hidden">
      
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYE-EyDBciWJ9zQFXBLaJ9ipIiQkuBSFGlayO7Zs-wKTF6OTI6GbBhQr4qmJt-2PM_io1pHrY3bDZ1GiSyum0jed7BenOFV50TWdqeDDEUkHFr2zx_SYLN_bfxqZvjOu2rmZy8nh4h1PKhjVnPcZmBH12zZUs6AKd5Cp5pF_1MCTSqbkESQQbUFypvzxicoVONMybLtY_J2KnPP5YREPQHjpTxXc-lkTPnWKpGQ30ltAyKAgyD8rsZyOdM6f1SXs0WHQaM9QQA2IlO')",
        }}
      />
      
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-[#0b1c30]/75 backdrop-blur-md z-0" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full ${isWide ? 'max-w-[700px]' : 'max-w-[500px]'} relative z-10 flex flex-col items-center`}
      >
        {/* Centered Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.svg" alt="TrendSearchor" className="w-12 h-12" />
          <span className="text-[34px] font-bold text-[#e6edf3] tracking-wide leading-none mt-1" style={{ fontFamily: "'M PLUS U', sans-serif" }}>
            trendsearchor
          </span>
        </div>

        {/* Card */}
        <div className="w-full bg-white p-8 sm:p-12 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 relative">

          {/* Tabs */}
          <div className="flex border-b border-[#c6c6cd]/60 mb-6">
            <Link
              to="/login"
              className={`flex-1 pb-2.5 text-center text-sm font-semibold transition-colors border-b-2 ${
                isLogin
                  ? 'text-[#0058be] border-[#0058be]'
                  : 'text-[#45464d] border-transparent hover:text-[#0058be]'
              }`}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className={`flex-1 pb-2.5 text-center text-sm font-semibold transition-colors border-b-2 ${
                isRegister
                  ? 'text-[#0058be] border-[#0058be]'
                  : 'text-[#45464d] border-transparent hover:text-[#0058be]'
              }`}
            >
              Create Account
            </Link>
          </div>

          {/* Header */}
          {title && (
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-[#0b1c30] mb-1">{title}</h1>
              {subtitle && <p className="text-sm text-[#45464d] leading-relaxed">{subtitle}</p>}
            </div>
          )}

          {children}

          {/* Footer */}
          <div className="mt-4 flex justify-center">
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#76777d] hover:text-[#0058be] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to homepage
            </Link>
          </div>
        </div>

        {/* Data powered footer */}
        <p className="mt-8 text-xs text-white/60 text-center">
          Data powered by Semantic Scholar &middot; OpenAlex &middot; Crossref
        </p>
      </motion.div>
    </div>
  );
}
