const LOGO_ICON_URL = new URL('../../../logo.svg', import.meta.url).href;

const variants = {
  navbar: { size: 'h-8 w-8', textSize: 'text-base', wrapper: 'gap-2.5' },
  footer: { size: 'h-7 w-7', textSize: 'text-sm', wrapper: 'gap-2' },
  auth: { size: 'h-9 w-9', textSize: 'text-lg', wrapper: 'gap-3' },
  iconOnly: { size: 'h-8 w-8', textSize: 'text-base', wrapper: '' },
};

export default function Logo({ variant = 'navbar', showText = true, className = '' }) {
  const { size, textSize, wrapper } = variants[variant] || variants.navbar;

  return (
    <div className={`flex items-center ${wrapper} ${className}`}>
      <div className="relative flex-shrink-0">
        <img
          alt="TrendSearchor logo"
          src={LOGO_ICON_URL}
          className={`${size} object-contain`}
        />
      </div>
      {showText && (
        <span className={`font-bold ${textSize} text-white tracking-tight whitespace-nowrap`}>
          Trend<span className="text-[#4A90E2]">Searchor</span>
        </span>
      )}
    </div>
  );
}
