import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BRAND_FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    text: 'Track research trends across thousands of journals and publications',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    text: 'Visualize trends with interactive charts and real-time analytics',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    ),
    text: 'Bookmark papers and keywords, get notified about new research',
  },
];

const BRAND_TESTIMONIAL = {
  quote: 'TrendSearchor helped me identify emerging topics in AI before they became mainstream. An essential tool for any serious researcher.',
  name: 'Dr. Minh Tran',
  role: 'Associate Professor, Computer Science',
  avatar: 'MT',
};

const GRADIENT_STYLES = {
  brand: 'linear-gradient(135deg, #1a3a2a 0%, #0f2318 100%)',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  accent: '#73b797',
};

export default function AuthLayout({ children, title, subtitle, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen flex bg-[#0d1117]">

      {/* ── Left: Brand Panel ─────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: GRADIENT_STYLES.brand }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-[#73b797]/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-[#4A90E2]/8 blur-3xl" />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#73b797]/20 border border-[#73b797]/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#73b797]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TrendSearchor</span>
        </div>

        {/* Center: Headline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Discover the next<br />
            <span className="text-[#73b797]">big idea</span> in research
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Track publication trends, explore emerging topics, and stay ahead in your field with AI-powered analytics.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          {BRAND_FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: GRADIENT_STYLES.card, border: `1px solid ${GRADIENT_STYLES.border}` }}>
              <div className="w-8 h-8 rounded-lg bg-[#73b797]/15 flex items-center justify-center flex-shrink-0 text-[#73b797]">
                {f.icon}
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom: Testimonial */}
        <div className="relative z-10 p-5 rounded-2xl" style={{ background: GRADIENT_STYLES.card, border: `1px solid ${GRADIENT_STYLES.border}` }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#73b797]/20 border border-[#73b797]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[#73b797]">{BRAND_TESTIMONIAL.avatar}</span>
            </div>
            <div>
              <p className="text-sm text-white/70 italic leading-relaxed mb-2">"{BRAND_TESTIMONIAL.quote}"</p>
              <p className="text-xs font-semibold text-white/80">{BRAND_TESTIMONIAL.name}</p>
              <p className="text-xs text-white/40">{BRAND_TESTIMONIAL.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12"
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#73b797]/20 border border-[#73b797]/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#73b797]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TrendSearchor</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          {title && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1.5">{title}</h1>
              {subtitle && <p className="text-sm text-[#8b949e]">{subtitle}</p>}
            </div>
          )}

          {children}

          {/* Footer link */}
          {footerText && (
            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-sm text-[#8b949e]">
                {footerText}{' '}
                <Link
                  to={footerLinkTo}
                  className="font-semibold text-[#73b797] hover:text-[#8fcfb3] transition-colors"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Powered by footer */}
        <p className="mt-8 text-xs text-[#484f58]">
          Data powered by Semantic Scholar · OpenAlex · Crossref
        </p>
      </motion.div>

    </div>
  );
}
