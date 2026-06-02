// Shared design tokens extracted from the codebase
// Used across all components to ensure consistency

// Dark theme palette (applied to dashboard layouts)
export const DARK_THEME = {
  bg: {
    base:     '#0d1117',   // Main content / sidebar background
    card:     '#0d1117',   // Card / section background
    elevated: '#161b22',   // Elevated surfaces (dropdowns, popovers)
    border:   '#30363d',   // Border color
    borderHover: '#484f58', // Border on hover
  },
  text: {
    primary:   '#ffffff',
    secondary: '#c9d1d9',
    muted:     '#8b949e',
    faint:     '#484f58',
  },
  banner: {
    info: '#304865',        // Profile banner color
  },
  avatar: {
    fallback: '#4a2d2a',   // Default avatar background
  },
  accent: {
    primary:   '#0058be',
    primaryHover: '#004395',
  },
};

export const COLORS = {
  bg: {
    primary:   '#f8f9ff',  // Main page canvas
    surface:   '#ffffff',  // Card / form backgrounds
    surfaceHover: '#eff4ff', // Elevated surface
  },
  border: {
    subtle: 'border-[#c6c6cd]',
    focus: 'border-[#0058be]/50',
    error: 'border-red-500/50',
    card: 'border-[#c6c6cd]/40',
    cardHover: 'border-[#0058be]/30',
  },
  text: {
    primary:   '#0b1c30',   // Headings / primary text
    secondary: '#45464d',   // Labels / body text
    muted:    '#76777d',    // Placeholder / muted text
    faint:    '#9ca3af',    // Disabled text
    accent:   '#0058be',    // Links / interactive (secondary blue)
    accentHover: '#004395', // Accent hover
  },
};

export const CLASSES = {
  inputBase: `w-full pl-10 pr-4 py-2.5 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30]
    placeholder:text-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#0058be]/40
    focus:border-[#0058be] transition-all`,
  inputError: `border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50`,

  btnPrimary: `w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#0058be]
    hover:bg-[#004395] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
    flex items-center justify-center gap-2`,
  btnPrimaryInline: `inline-flex items-center gap-2 px-5 py-2.5 bg-[#0058be] hover:bg-[#004395]
    text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm shadow-[#0058be]/20`,
  btnSecondary: `inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#eff4ff]
    text-[#0b1c30] font-semibold text-sm rounded-lg border border-[#c6c6cd] transition-all duration-200`,

  card: `bg-white border border-[#c6c6cd]/40 rounded-xl p-6`,
};

// Dark theme utility classes
export const DARK_CLASSES = {
  card: `bg-[#0d1117] border border-gray-800 rounded-2xl p-6`,
  cardHover: `bg-[#0d1117] border border-gray-800 hover:border-gray-700 rounded-2xl p-6`,
  cardBanner: `rounded-t-2xl`,
  inputBase: `w-full pl-10 pr-10 py-3 bg-[#0d1117] border-2 border-gray-800 text-white font-medium text-sm rounded-xl
    placeholder:text-gray-600 focus:outline-none focus:border-[#0058be] transition-all`,
  inputError: `border-red-500/50 focus:border-red-500`,
  selectTrigger: `w-full flex items-center justify-between text-sm bg-[#0d1117] border border-gray-800 transition-all`,
  selectDropdown: `absolute z-50 min-w-full w-max mt-1.5 bg-[#0d1117] border border-gray-800 rounded-xl shadow-xl shadow-black/30 overflow-hidden`,
  avatarFallback: `flex items-center justify-center font-bold bg-[#4a2d2a] text-white rounded-full`,
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
