import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export const LenisContext = createContext({ isReady: false, scrollTo: () => {} });

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let rafId;

    async function initLenis() {
      const Lenis = (await import('lenis')).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenisRef.current = lenis;
      window.__lenisInstance = lenis;

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    initLenis();
    setIsReady(true);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      window.__lenisInstance = null;
    };
  }, []);

  const scrollTo = useCallback((target, options) => {
    lenisRef.current?.scrollTo(target, options);
  }, []);

  return (
    <LenisContext.Provider value={{ isReady, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
