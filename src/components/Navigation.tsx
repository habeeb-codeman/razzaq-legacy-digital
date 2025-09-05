import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import razzaqLogo from '@/assets/razzaq-logo.png';
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };
  const navItems = [{
    label: 'Home',
    id: 'hero'
  }, {
    label: 'Legacy',
    id: 'legacy'
  }, {
    label: 'Capabilities',
    id: 'capabilities'
  }, {
    label: 'Partnerships',
    id: 'partnerships'
  }, {
    label: 'Advantage',
    id: 'advantage'
  }, {
    label: 'Contact',
    id: 'contact'
  }];
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border/20' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{
          scale: 1.05
        }} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={razzaqLogo} alt="Razzaq Automotives" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">Razzaq Automotives</h2>
              <p className="text-accent text-xs font-medium">Estd. 1976</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="nav-link font-medium">
                {item.label}
              </button>)}
            <Button onClick={() => scrollToSection('contact')} variant="default" className="btn-hero">
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="lg:hidden mt-4 pb-4 border-t border-border/20 bg-background/95 backdrop-blur-sm rounded-b-lg">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors">
                  {item.label}
                </button>)}
              <Button onClick={() => scrollToSection('contact')} className="btn-hero mx-4 mt-2">
                Get Quote
              </Button>
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navigation;