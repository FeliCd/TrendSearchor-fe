import { useEffect, useRef } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsMarqueeSection from '@/components/home/StatsMarqueeSection';
import Footer from '@/components/layout/Footer';
import { useLenis } from '@/providers/LenisProvider';
import { heroData, featuresData, statsData, ctaData } from '@/mocks/homeData';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
    const scrollContainerRef = useRef(null);
    const { disableGlobal, enableGlobal } = useLenis();

    useEffect(() => {
        // Disable the global vertical Lenis instance to prevent conflicts
        disableGlobal();

        let lenisInstance = null;
        let rafId = null;

        import('lenis').then(({ default: Lenis }) => {
            const container = scrollContainerRef.current;
            if (!container) return;

            lenisInstance = new Lenis({
                wrapper: container,
                content: container.firstElementChild,
                orientation: 'horizontal',
                gestureOrientation: 'vertical', 
                smoothWheel: true,
                wheelMultiplier: 1.5, // Slightly faster for horizontal feel
                duration: 1.5, // Slower smoothing for "story telling" feel
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });

            const raf = (time) => {
                lenisInstance.raf(time);
                rafId = requestAnimationFrame(raf);
            };
            rafId = requestAnimationFrame(raf);
        });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (lenisInstance) lenisInstance.destroy();
            // Re-enable global Lenis when leaving the homepage
            enableGlobal();
        };
    }, [disableGlobal, enableGlobal]);

    return (
        <div 
            ref={scrollContainerRef}
            className="bg-[#151515] text-white relative h-screen w-full flex overflow-x-auto overflow-y-hidden hide-scrollbar overscroll-x-none"
        >
            {/* Background Grid Pattern */}
            <div 
                className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #ffffff 1px, transparent 1px),
                        linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* The single content wrapper that Lenis will translate horizontally */}
            <div className="flex flex-nowrap h-full w-max relative z-10 pr-1">
                <HeroSection scrollContainer={scrollContainerRef} data={heroData} />
                <FeaturesSection scrollContainer={scrollContainerRef} data={featuresData} />
                <StatsMarqueeSection scrollContainer={scrollContainerRef} data={statsData} />
                <div className="w-screen h-screen shrink-0 relative flex flex-col justify-center items-center bg-transparent">
                    <Footer />
                </div>
            </div>
        </div>
    );
}