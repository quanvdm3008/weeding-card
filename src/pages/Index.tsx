import FallingPetals from "@/components/FallingPetals";
import HeroSection from "@/components/HeroSection";
import TemplateGallery from "@/components/TemplateGallery";
import Navbar from "@/components/landing/Navbar";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { FloatingSupportChat } from "@/components/landing/FloatingSupportChat";
import { EventSuiteShowcase } from "@/components/landing/EventSuiteShowcase";
import { ContactConsultationSection } from "@/components/landing/ContactConsultationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ScrollProgress accentColor="hsl(38 47% 58%)" />
      <FallingPetals />
      <Navbar />

      {/* Hero section */}
      <HeroSection />

      {/* High-end templates collection */}
      <TemplateGallery />

      {/* Event day interactive suite (LED Wall, Lucky Draw, Check-in, AI, Photobooth) */}
      <EventSuiteShowcase />

      {/* Direct consultation & Discord integration form */}
      <ContactConsultationSection />

      {/* Bottom CTA section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Floating support chat linked to Discord */}
      <FloatingSupportChat />
    </div>
  );
};

export default Index;
