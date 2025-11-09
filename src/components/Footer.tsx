// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
// import razzaqLogo from '@/assets/razzaq-logo.png';
// const Footer = () => {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1
//   });
//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({
//         behavior: 'smooth'
//       });
//     }
//   };
//   return <footer className="relative bg-background/95 border-t border-border/20">
//       {/* Glassmorphism Background */}
//       <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-card/20 backdrop-blur-md" />
      
//       <div className="relative container mx-auto px-6 py-16">
//         <motion.div ref={ref} initial={{
//         opacity: 0,
//         y: 30
//       }} animate={inView ? {
//         opacity: 1,
//         y: 0
//       } : {}} transition={{
//         duration: 0.8
//       }} className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
//           {/* Company Info */}
//           <div className="space-y-6">
//             <div className="flex items-center space-x-3">
//               <img src={razzaqLogo} alt="Razzaq Automotives" className="w-12 h-12" />
//               <div>
//                 <h3 className="font-heading font-bold text-xl">Razzaq Automotives</h3>
//                 <p className="text-accent text-sm">Estd. 1976</p>
//               </div>
//             </div>
//             <p className="text-muted-foreground leading-relaxed">
//               Five decades of excellence in heavy vehicle solutions. Your trusted partner 
//               for TATA, Ashok Leyland, and Bharat Benz parts in Vijayawada.
//             </p>
//             <div className="flex space-x-4">
//               <motion.a whileHover={{
//               scale: 1.1
//             }} href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
//                 <Facebook className="w-5 h-5 text-primary" />
//               </motion.a>
//               <motion.a whileHover={{
//               scale: 1.1
//             }} href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
//                 <Instagram className="w-5 h-5 text-primary" />
//               </motion.a>
//               <motion.a whileHover={{
//               scale: 1.1
//             }} href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
//                 <Linkedin className="w-5 h-5 text-primary" />
//               </motion.a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="space-y-6">
//             <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
//             <div className="space-y-3">
//               {[{
//               label: 'Our Legacy',
//               id: 'legacy'
//             }, {
//               label: 'Capabilities',
//               id: 'capabilities'
//             }, {
//               label: 'Partnerships',
//               id: 'partnerships'
//             }, {
//               label: 'Our Advantage',
//               id: 'advantage'
//             }].map(item => <motion.button key={item.id} whileHover={{
//               x: 5
//             }} onClick={() => scrollToSection(item.id)} className="block text-muted-foreground hover:text-primary transition-colors">
//                   {item.label}
//                 </motion.button>)}
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-6">
//             <h4 className="font-heading font-semibold text-lg">Contact Info</h4>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     3rd Cross Road, Auto Nagar<br />
//                     Vijayawada, Andhra Pradesh 520007
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     +91 888-567-3388<br />
//                     +91 905-297-2421
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     razzaqautomotives.vij@gmail.com
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Business Hours */}
//           <div className="space-y-6">
//             <h4 className="font-heading font-semibold text-lg">Business Hours</h4>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <Clock className="w-5 h-5 text-primary" />
//                 <div>
//                   <p className="text-sm font-medium">Monday - Saturday</p>
//                   <p className="text-sm text-muted-foreground">9:00 AM - 8:30 PM</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Clock className="w-5 h-5 text-accent" />
//                 <div>
//                   <p className="text-sm font-medium">Sunday</p>
//                   <p className="text-sm text-muted-foreground">9:00 AM - 1:30 PM</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Bottom Bar */}
//         <motion.div initial={{
//         opacity: 0
//       }} animate={inView ? {
//         opacity: 1
//       } : {}} transition={{
//         duration: 0.8,
//         delay: 0.4
//       }} className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           <p className="text-sm text-muted-foreground">© 2025 Razzaq Automotives. All rights reserved.</p>
//           <div className="flex space-x-6 text-sm">
//             <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
//               Terms of Service
//             </a>
//           </div>
//         </motion.div>
//       </div>
//     </footer>;
// };
// export default Footer;





















import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import razzaqLogo from '@/assets/razzaq-logo.png';
import { useTreasureHunt } from '@/hooks/useTreasureHunt';

const REVIEW_URL = "https://g.page/r/CVo8voo1GVplEBM/review";
const MAP_APP_LINK = "https://maps.app.goo.gl/iw9V2EXDWC7off1MA";
const MAP_DIRECT_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=16.5087592,80.6480903";

const PHONE_1 = "+918885673388";
const PHONE_2 = "+919052972421";
const EMAIL = "razzaqautomotives.vij@gmail.com";
const ADDRESS_LINE_1 = "3rd Cross Road, Auto Nagar";
const ADDRESS_LINE_2 = "Vijayawada, Andhra Pradesh 520007";

const openExternal = (url: string) => {
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
};

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });
  const [estdClicks, setEstdClicks] = useState(0);
  const { updateProgress } = useTreasureHunt();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleEstdClick = () => {
    setEstdClicks((prev) => {
      const newClicks = prev + 1;
      if (newClicks >= 3) {
        updateProgress('clue5');
        return 0;
      }
      return newClicks;
    });
  };

  return (
    <footer className="relative bg-background/95 border-t border-border/20">
      {/* Subtle glass layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-card/20 backdrop-blur-md pointer-events-none" />

      <div className="relative container mx-auto px-6 py-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-12"
        >
          {/* Company */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* keep as img — if you use Next/Image replace accordingly */}
              <img
                src={razzaqLogo}
                alt="Razzaq Automotives Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-heading font-bold text-xl">
                  Razzaq Automotives
                </h3>
                <p 
                  className="text-accent text-sm cursor-pointer select-none" 
                  onClick={handleEstdClick}
                  title="Triple-click for a surprise!"
                >
                  Estd. 1976
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Five decades of excellence in heavy vehicle solutions. Your trusted
              partner for TATA, Ashok Leyland, and Bharat Benz parts in Vijayawada.
            </p>

            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Razzaq Automotives Facebook"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Razzaq Automotives Instagram"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Razzaq Automotives LinkedIn"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
            <nav className="space-y-3" aria-label="quick links">
              {[
                { label: "Our Legacy", id: "legacy" },
                { label: "Partnerships", id: "partnerships" },
                { label: "Our Advantage", id: "advantage" },
                { label: "Contact", id: "contact" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => scrollToSection(item.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Contact Info</h4>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=16.5087592,80.6480903`}
                    onClick={(e) => {
                      e.preventDefault();
                      openExternal(MAP_DIRECT_LINK);
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Open Razzaq Automotives location in Google Maps"
                  >
                    {ADDRESS_LINE_1}
                    <br />
                    {ADDRESS_LINE_2}
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <a
                    href={`tel:${PHONE_1}`}
                    className="block hover:text-primary transition-colors"
                    aria-label={`Call ${PHONE_1}`}
                  >
                    +91 888-567-3388
                  </a>
                  <a
                    href={`tel:${PHONE_2}`}
                    className="block hover:text-primary transition-colors"
                    aria-label={`Call ${PHONE_2}`}
                  >
                    +91 905-297-2421
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Email ${EMAIL}`}
                  >
                    {EMAIL}
                  </a>
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

              {/* Quick action buttons */}
              <div className="pt-3 flex flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://g.page/r/CVo8voo1GVplEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent px-4 py-2 text-sm rounded-md"
                  aria-label="Review Razzaq Automotives on Google"
                >
                  Review Us
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://maps.app.goo.gl/iw9V2EXDWC7off1MA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass px-4 py-2 text-sm rounded-md"
                  aria-label="Open location in maps"
                >
                  Open in Maps
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Razzaq Automotives. All rights reserved.
          </p>

          {/* Aligned buttons — horizontal on md+ screens, stacked on small screens */}
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

