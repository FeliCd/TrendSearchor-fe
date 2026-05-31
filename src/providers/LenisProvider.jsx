import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export const LenisContext = createContext({ isReady: false, scrollTo: () => {}, initScroller: () => {}, disableGlobal: () => {}, enableGlobal: () => {} });
export const useLenis = () => useContext(LenisContext);

const LENIS_OPTS = { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 };

function createLenisInstance(target = document.documentElement) {
  return import('lenis').then(({ default: Lenis }) => new Lenis({ ...LENIS_OPTS, wrapper: target, content: target === document.documentElement ? document.body : target }));
}

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const scopedLenisRef = useRef(null);
  const rafIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isScopedReady, setIsScopedReady] = useState(false);

  useEffect(() => {
    createLenisInstance().then((lenis) => {
      lenisRef.current = lenis;
      window.__lenisInstance = lenis;
      const raf = (time) => {
        if (document.documentElement.classList.contains('lenis-disabled')) return;
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      };
      rafIdRef.current = requestAnimationFrame(raf);
      setIsReady(true);
    });
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      window.__lenisInstance = null;
      scopedLenisRef.current?.destroy();
      scopedLenisRef.current = null;
      setIsScopedReady(false);
    };
  }, []);

  const stopGlobal = useCallback(() => {
    if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
    if (lenisRef.current) { lenisRef.current.stop(); lenisRef.current = null; window.__lenisInstance = null; }
  }, []);

  const startGlobal = useCallback(() => {
    createLenisInstance().then((lenis) => {
      lenisRef.current = lenis;
      window.__lenisInstance = lenis;
      const raf = (time) => { lenis.raf(time); rafIdRef.current = requestAnimationFrame(raf); };
      rafIdRef.current = requestAnimationFrame(raf);
    });
  }, []);

  const initScroller = useCallback((element) => {
    if (scopedLenisRef.current) { scopedLenisRef.current.destroy(); scopedLenisRef.current = null; }
    if (!element) return;
    const state = { rafId: null };
    createLenisInstance(element).then((lenis) => {
      scopedLenisRef.current = lenis;
      setIsScopedReady(true);
      const raf = (time) => { lenis.raf(time); state.rafId = requestAnimationFrame(raf); };
      state.rafId = requestAnimationFrame(raf);
    });
    return () => {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      scopedLenisRef.current?.destroy();
      scopedLenisRef.current = null;
      setIsScopedReady(false);
    };
  }, []);

  const scrollTo = useCallback((target, options) => {
    scopedLenisRef.current ? scopedLenisRef.current.scrollTo(target, options) : lenisRef.current?.scrollTo(target, options);
  }, []);

  return (
    <LenisContext.Provider value={{ isReady: isReady && isScopedReady, isScopedReady, scrollTo, initScroller, disableGlobal: stopGlobal, enableGlobal: startGlobal }}>
      {children}
    </LenisContext.Provider>
  );
}
