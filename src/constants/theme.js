// Shared design tokens extracted from the codebase
// Used across all components to ensure consistency

export const COLORS = {
  bg: {
    primary: '#0d1117',      // Main page background (GitHub dark)
    surface: '#161b22',       // Card/form backgrounds
    surfaceHover: '#21262d',  // Elevated surface
  },
  border: {
    subtle: 'border-white/10',
    focus: 'border-[#4A90E2]/50',
    error: 'border-red-500/50',
    card: 'border-[#21262d]',
    cardHover: 'border-[#30363d]',
  },
  text: {
    primary: '#e6edf3',      // Headings / primary text
    secondary: '#c9d1d9',     // Labels / body text
    muted: '#8b949e',         // Placeholder / muted text
    faint: '#484f58',         // Disabled text
    accent: '#4A90E2',        // Links / interactive accent (blue)
    accentHover: '#6ba3e0',   // Accent hover state
    emerald: '#246E52',       // Secondary accent (emerald)
    emeraldHover: '#1e5943',  // Emerald hover
  },
  // Tailwind opacity helpers for existing palette
  alpha: {
    subtle: 'white/[0.06]',
    faintBorder: 'white/[0.06]',
  },
};

export const CLASSES = {
  // Input
  inputBase: `w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-lg text-[#c9d1d9]
    text-sm placeholder:text-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50
    focus:border-[#4A90E2]/50 transition-all`,
  inputError: `border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50`,

  // Button
  btnPrimary: `w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#0d1117] bg-white
    hover:bg-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
    flex items-center justify-center gap-2`,
  btnPrimaryInline: `inline-flex items-center gap-2 px-5 py-2.5 bg-[#246E52] hover:bg-[#1e5943]
    text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20`,
  btnSecondary: `inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10
    text-[#e6edf3] font-semibold text-sm rounded-lg border border-white/10 transition-all duration-200`,

  // Card
  card: `bg-[#161b22] border border-[#21262d] rounded-xl p-6`,
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
};

export const ANIMATION = {
  duration: { fast: '150ms', normal: '200ms', slow: '300ms' },
  stagger: '0.08s',
};
