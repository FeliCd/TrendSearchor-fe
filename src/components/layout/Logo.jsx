export default function Logo({ 
  className = '', 
  variant = 'default',
  showText = true 
}) {
  const isWhite = variant === 'navbar' || variant === 'footer';

  const variants = {
    default: {
      wrapper: '',
      size: 'w-10 h-10',
      textSize: 'text-2xl',
      textColor: 'text-gray-900',
    },
    navbar: {
      wrapper: '',
      size: 'w-8 h-8',
      textSize: 'text-xl',
      textColor: 'text-white',
    },
    footer: {
      wrapper: 'flex-col sm:flex-row items-center',
      size: 'w-16 h-16',
      textSize: 'text-4xl',
      textColor: 'text-white',
    },
    auth: {
      wrapper: 'gap-4',
      size: 'w-14 h-14',
      textSize: 'text-3xl',
      textColor: 'text-[#0b1c30]',
    },
  };

  const { wrapper, size, textSize, textColor } = variants[variant] || variants.default;

  return (
    <div className={`flex items-center gap-3 ${wrapper} ${className} group cursor-pointer`}>
      <img 
        src="/logo.svg" 
        alt="TrendSearchor Logo" 
        className={`${size} object-contain transition-transform group-hover:scale-105 ${isWhite ? 'brightness-0 invert' : ''}`} 
      />
      {showText && (
        <span className={`font-black tracking-tight ${textSize} ${textColor}`}>
          Trend<span className={isWhite ? 'text-white' : 'text-[#0058be]'}>Searchor</span>
        </span>
      )}
    </div>
  );
}
