import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import LegacySection from '@/components/LegacySection';
import CapabilitiesSection from '@/components/CapabilitiesSection';
import PartnershipsSection from '@/components/PartnershipsSection';
import AdvantageSection from '@/components/AdvantageSection';
import ClientTrustSection from '@/components/ClientTrustSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title="Heavy Vehicle Parts & Service Solutions Since 1976"
        description="Razzaq Automotives is Vijayawada's premier supplier of TATA, Ashok Leyland & Bharat Benz parts. 50+ years of trusted service for major fleets in Andhra Pradesh."
        keywords="truck parts Vijayawada, Ashok Leyland parts Autonagar, TATA truck body parts Andhra Pradesh, heavy vehicle spares Vijayawada, truck cabin parts, fuel tank systems"
      />
      <Navigation />
      <HeroSection />
      <LegacySection />
      <CapabilitiesSection />
      <PartnershipsSection />
      <AdvantageSection />
      <ClientTrustSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
