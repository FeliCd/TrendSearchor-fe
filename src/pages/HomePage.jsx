import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
    return (
        <div className="bg-white text-[#0b1c30] relative min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <CTASection />
        </div>
    );
}