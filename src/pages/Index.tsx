import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import LegacySection from '@/components/LegacySection';
import CapabilitiesSection from '@/components/CapabilitiesSection';
import PartnershipsSection from '@/components/PartnershipsSection';
import AdvantageSection from '@/components/AdvantageSection';
import ClientTrustSection from '@/components/ClientTrustSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <LegacySection />
      <CapabilitiesSection />
      <PartnershipsSection />
      <AdvantageSection />
      <ClientTrustSection />
      <ContactSection />
    </div>
  );
};

export default Index;
