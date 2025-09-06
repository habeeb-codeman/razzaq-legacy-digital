import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import razzaqLogo from '@/assets/razzaq-logo.png';
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
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
    id: 'hero',
    isRoute: false
  }, {
    label: 'Legacy',
    id: 'legacy',
    isRoute: false
  }, {
    label: 'Capabilities',
    id: 'capabilities',
    isRoute: false
  }, {
    label: 'Partnerships',
    id: 'partnerships',
    isRoute: false
  }, {
    label: 'Advantage',
    id: 'advantage',
    isRoute: false
  }, {
    label: 'Gallery',
    id: '/gallery',
    isRoute: true
  }, {
    label: 'Contact',
    id: 'contact',
    isRoute: false
  }];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      setIsOpen(false);
    } else {
      scrollToSection(item.id);
    }
  };
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border/20' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => (
              item.isRoute ? (
                <Link key={item.id} to={item.id} className="nav-link font-medium">
                  {item.label}
                </Link>
              ) : (
                <button key={item.id} onClick={() => handleNavClick(item)} className="nav-link font-medium">
                  {item.label}
                </button>
              )
            ))}
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
              {navItems.map(item => (
                item.isRoute ? (
                  <Link key={item.id} to={item.id} onClick={() => setIsOpen(false)} className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.id} onClick={() => handleNavClick(item)} className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors">
                    {item.label}
                  </button>
                )
              ))}
              <Button onClick={() => scrollToSection('contact')} className="btn-hero mx-4 mt-2">
                Get Quote
              </Button>
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navigation;