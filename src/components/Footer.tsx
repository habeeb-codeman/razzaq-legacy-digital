import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import razzaqLogo from '@/assets/razzaq-logo.png';

const Footer = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative bg-background/95 border-t border-border/20">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-card/20 backdrop-blur-md" />
      
      <div className="relative container mx-auto px-6 py-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-12"
        >
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={razzaqLogo} alt="Razzaq Automotives" className="w-12 h-12" />
              <div>
                <h3 className="font-heading font-bold text-xl">Razzaq Automotives</h3>
                <p className="text-accent text-sm">Estd. 1976</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Five decades of excellence in heavy vehicle solutions. Your trusted partner 
              for TATA, Ashok Leyland, and Bharat Benz parts in Vijayawada.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: 'Our Legacy', id: 'legacy' },
                { label: 'Capabilities', id: 'capabilities' },
                { label: 'Partnerships', id: 'partnerships' },
                { label: 'Our Advantage', id: 'advantage' }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => scrollToSection(item.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    3rd Cross Road, Auto Nagar<br />
                    Vijayawada, Andhra Pradesh 520007
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    +91 888-567-3388<br />
                    +91 905-297-2421
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    razzaqautomotives.vij@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Business Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Monday - Saturday</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 8:30 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Sunday</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 1:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-sm text-muted-foreground">
            © 2024 Razzaq Automotives. All rights reserved. | Powering progress since 1976.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;