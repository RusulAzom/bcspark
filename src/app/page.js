import Navbar from "@/components/Navbar";
// adds 
import AdBanner728 from '@/components/add/adstra/AdBanner728';
import NativeBanner from '@/components/add/adstra/NativeBanner';
import SocialBar from '@/components/add/adstra/SocialBar';

import HeroSection from "@/components/HeroSection";
import InfoRow from "@/components/InfoRow";
import WhyChooseBCSpark from "@/components/WhyChooseBCSpark";
import ToolsGrid from "@/components/ToolsGrid";
import PricingSection from "@/components/PricingSection";
import CtaAndStats from "@/components/CtaAndStats";
import Footer from "@/components/Footer";
import BottomNewsTicker from "@/components/BottomNewsTicker";
import { TodayHistoryProvider } from "@/components/TodayHistoryProvider";

export default function Home() {
  return (
    <TodayHistoryProvider>
      <div className="flex min-h-screen flex-col bg-brand-bg text-primary pb-10">
      {/* Sticky Navigation Bar */}
      <Navbar />

      <main className="flex-1 pb-10">
        {/* Hero Section: Top Tools List + Carousel */}
        <HeroSection />

        {/* Ad Banner directly before Hero Carousel */}
        {/* <AdBanner728 /> */}

        {/* Info Row: Birthday Card + Mock Test Form + Productivity Widgets */}
        <InfoRow />

        {/* Feature Highlights: Why Choose BCSpark */}
        <WhyChooseBCSpark />

        {/* Ad Banner directly before Hero Carousel */}
        {/* <AdBanner728 /> */}

        {/* Tools Grid: 20 tools */}
        <ToolsGrid />

        {/* Pricing Section: 3 cards */}
        <PricingSection />

        {/* Stats Card & Full-Width Call-to-Action Banner */}
        <CtaAndStats />
        
        {/* Ad Banner */}
        {/* <NativeBanner /> */}
        {/* Ad Banner */}
        {/* <SocialBar /> */}
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Fixed news ticker scroll at the very bottom */}
      <BottomNewsTicker />
      </div>
    </TodayHistoryProvider>
  );
}

