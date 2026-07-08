import {
  FeaturesSection,
  StatsSection,
  WaitlistSection,
} from "@/components/landing";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <main>
        <Header />
        <Hero />
        <StatsSection />
        <FeaturesSection />
        {}
        <WaitlistSection />
        <Footer />
      </main>
    </div>
  );
}
