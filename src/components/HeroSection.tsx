import { motion } from 'framer-motion';
import { ArrowDown, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroTruck from '@/assets/hero-truck-cinematic.jpg';
const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={heroTruck} alt="Modern truck on highway at dusk - Razzaq Automotives" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-accent/40 mb-6 shadow-lg">
            <span className="text-accent font-medium">Established 1976</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-foreground">50+ Years of Excellence</span>
          </motion.div>

          {/* Main Headlines */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-hero mb-6 leading-tight">
            <span className="block">Honoring Our Heritage.</span>
            <span className="block text-accent-glow">Advancing Your Fleet.</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            Vijayawada's most trusted source for advanced heavy vehicle body solutions for 
            <span className="text-primary font-semibold"> TATA</span>, 
            <span className="text-primary font-semibold"> Ashok Leyland</span>, and 
            <span className="text-primary font-semibold"> Bharat Benz</span>.
          </motion.p>

          {/* Action Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button onClick={() => scrollToSection('legacy')} size="lg" className="btn-hero text-lg px-8 py-6">
              Explore Our Legacy
            </Button>
            <Button onClick={() => scrollToSection('contact')} variant="outline" size="lg" className="btn-outline-hero text-lg px-8 py-6">
              Connect With Us
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.8
        }} className="flex flex-col sm:flex-row items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+91 888-567-3388</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-accent rounded-full" />
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>razzaqautomotives.vij@gmail.com</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 1,
      delay: 1.2
    }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={() => scrollToSection('legacy')}>
        <motion.div animate={{
        y: [0, 10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }} className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <span className="text-sm mb-2">Scroll to explore</span>
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>;
};
export default HeroSection;