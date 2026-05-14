import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = window.__lenisInstance;
    if (!lenis) return;

    const handleScroll = () => {
      const scroll = lenis.targetScroll;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(totalHeight > 0 ? Math.min(1, scroll / Math.max(1, totalHeight)) : 0);
    };

    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, []);

  return progress;
}
