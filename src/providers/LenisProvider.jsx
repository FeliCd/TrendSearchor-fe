import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export const LenisContext = createContext({
  isReady: false,
  scrollTo: () => {},
  initScroller: () => {},
  disableGlobal: () => {},
  enableGlobal: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const scopedLenisRef = useRef(null);
  const rafIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isScopedReady, setIsScopedReady] = useState(false);

  useEffect(() => {
    async function initLenis() {
      const Lenis = (await import('lenis')).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        wrapper: document.documentElement,
        content: document.body,
      });
      lenisRef.current = lenis;
      window.__lenisInstance = lenis;

      function raf(time) {
        if (document.documentElement.classList.contains('lenis-disabled')) return;
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);
    }

    initLenis();
    setIsReady(true);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      window.__lenisInstance = null;
      if (scopedLenisRef.current) {
        scopedLenisRef.current.destroy();
        scopedLenisRef.current = null;
      }
      setIsScopedReady(false);
    };
  }, []);

  const stopGlobal = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (lenisRef.current) {
      lenisRef.current.stop();
      lenisRef.current = null;
      window.__lenisInstance = null;
    }
  }, []);

  const startGlobal = useCallback(() => {
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        wrapper: document.documentElement,
        content: document.body,
      });
      lenisRef.current = lenis;
      window.__lenisInstance = lenis;

      function raf(time) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);
    });
  }, []);

  const initScroller = useCallback((element) => {
    if (scopedLenisRef.current) {
      scopedLenisRef.current.destroy();
      scopedLenisRef.current = null;
    }
    if (!element) return;

    const state = { rafId: null };
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        wrapper: element,
        content: element,
      });
      scopedLenisRef.current = lenis;
      setIsScopedReady(true);

      function raf(time) {
        lenis.raf(time);
        state.rafId = requestAnimationFrame(raf);
      }
      state.rafId = requestAnimationFrame(raf);
    });
    return () => {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      if (scopedLenisRef.current) {
        scopedLenisRef.current.destroy();
        scopedLenisRef.current = null;
      }
      setIsScopedReady(false);
    };
  }, []);

  const scrollTo = useCallback((target, options) => {
    if (scopedLenisRef.current) {
      scopedLenisRef.current.scrollTo(target, options);
    } else {
      lenisRef.current?.scrollTo(target, options);
    }
  }, []);

  return (
    <LenisContext.Provider
      value={{
        isReady: isReady && isScopedReady,
        isScopedReady,
        scrollTo,
        initScroller,
        disableGlobal: stopGlobal,
        enableGlobal: startGlobal,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
