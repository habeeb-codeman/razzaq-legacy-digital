// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';

// const ContactSection = () => {
//   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate form submission
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     toast({
//       title: "Message Sent Successfully!",
//       description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
//     });

//     setFormData({
//       name: '',
//       company: '',
//       email: '',
//       phone: '',
//       message: ''
//     });

//     setIsSubmitting(false);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const contactDetails = [
//     {
//       icon: <Phone className="w-5 h-5" />,
//       title: 'Call Us Directly',
//       details: ['+91 888-567-3388 (Mr. Abdul Raqeeb)', '+91 905-297-2421 (Mr. Abdul Aleem, Manager)'],
//       action: 'Call Now'
//     },
//     {
//       icon: <Mail className="w-5 h-5" />,
//       title: 'Email Support',
//       details: ['razzaqautomotives.vij@gmail.com', 'Quick response within 4 hours'],
//       action: 'Send Email'
//     }
//   ];

//   return (
//     <section id="contact" className="py-24 bg-card/10">
//       <div className="container mx-auto px-6">
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-section-title mb-6">
//             Let's Build Your <span className="text-primary">Success Together</span>
//           </h2>
//           <div className="industrial-line w-24 mx-auto mb-6" />
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
//             Ready to experience five decades of automotive excellence? Get in touch with our team 
//             for expert consultation and premium heavy vehicle solutions.
//           </p>
//         </motion.div>

//         <div className="grid lg:grid-cols-3 gap-12 mb-16">
//           {/* Contact Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={inView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="lg:col-span-2"
//           >
//             <div className="glass-card">
//               <h3 className="text-2xl font-heading font-semibold mb-6">
//                 Send us a Message
//               </h3>
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium mb-2">
//                       Full Name *
//                     </label>
//                     <Input
//                       id="name"
//                       name="name"
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full"
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="company" className="block text-sm font-medium mb-2">
//                       Company Name
//                     </label>
//                     <Input
//                       id="company"
//                       name="company"
//                       type="text"
//                       value={formData.company}
//                       onChange={handleInputChange}
//                       className="w-full"
//                       placeholder="Your company name (optional)"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium mb-2">
//                       Email Address *
//                     </label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full"
//                       placeholder="your@email.com"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium mb-2">
//                       Phone Number *
//                     </label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       required
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className="w-full"
//                       placeholder="+91 XXXXX-XXXXX"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium mb-2">
//                     Message *
//                   </label>
//                   <Textarea
//                     id="message"
//                     name="message"
//                     required
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     rows={5}
//                     className="w-full resize-none"
//                     placeholder="Tell us about your requirements, fleet details, or any questions you have..."
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="btn-hero w-full py-6 text-lg disabled:opacity-50"
//                 >
//                   <div className="flex items-center">
//                     <Send className="w-5 h-5 mr-2" />
//                     {isSubmitting ? 'Sending...' : 'Send Message'}
//                   </div>
//                 </Button>
//               </form>
//             </div>
//           </motion.div>

//           {/* Contact Information */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={inView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="space-y-6"
//           >
//             {contactDetails.map((detail, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={inView ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
//                 className="glass-card group hover:shadow-glow transition-all duration-300"
//               >
//                 <div className="flex items-start space-x-4">
//                   <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-primary-foreground">
//                       {detail.icon}
//                     </span>
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
//                       {detail.title}
//                     </h4>
//                     <div className="space-y-1">
//                       {detail.details.map((line, lineIndex) => (
//                         <p key={lineIndex} className="text-sm text-muted-foreground">
//                           {line}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Google Review Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="text-center mb-16"
//         >
//           <Button
//             onClick={() => window.open('https://g.page/r/CVo8voo1GVplEBM/review', '_blank')}
//             className="btn-accent px-8 py-4 text-sm font-medium group relative overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             <div className="relative flex items-center justify-center">
//               <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Review Us on Google
//             </div>
//           </Button>
//         </motion.div>

//         {/* Address Line */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="text-center mb-8"
//         >
//           <div className="flex items-center justify-center space-x-2 text-muted-foreground">
//             <MapPin className="w-4 h-4" />
//             <p className="text-lg">Razzaq Automotives, 3rd Cross Road, Auto Nagar, Vijayawada, Andhra Pradesh 520007</p>
//           </div>
//         </motion.div>

//         {/* Large Google Maps */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 1 }}
//           className="glass-card overflow-hidden p-0"
//         >
//           <div className="h-96 w-full">
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.419016847346!2d80.61823507532998!3d16.505406484132817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d4c93%3A0x65965501d5bc3c4a!2sRazzaq%20Automotives!5e0!3m2!1sen!2sin!4v1732567890123!5m2!1sen!2sin"
//               width="100%"
//               height="100%"
//               style={{ border: 0, filter: 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
//               allowFullScreen={true}
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//               title="Razzaq Automotives - Auto Nagar, Vijayawada"
//             />
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;










































import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, Send, HardHat, Building, Award, Star } from 'lucide-react';

// Main App Component
const App = () => {
    return (
        <div className="bg-[#0B1726] text-[#F6F4F2] font-sans antialiased">
            <Header />
            <main>
                <HeroSection />
                <LegacySection />
                <MetricsSection />
                <CapabilitiesSection />
                <PartnersSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

// Header Component
const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = ["Legacy", "Capabilities", "Partners", "Contact"];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B1726]/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold font-heading tracking-wider">
                    Razzaq Automotives
                </a>
                <nav className="hidden md:flex space-x-8">
                    {navItems.map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-[#F6F4F2]/80 hover:text-[#00A89D] transition-colors duration-300">
                            {item}
                        </a>
                    ))}
                </nav>
                 <a href="#contact" className="hidden md:inline-block px-6 py-2 border border-[#00A89D] text-[#00A89D] rounded-full hover:bg-[#00A89D] hover:text-[#0B1726] transition-all duration-300">
                    Get a Quote
                </a>
            </div>
        </header>
    );
};

// Hero Section Component
const HeroSection = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden text-center text-white">
            <motion.div
                className="absolute inset-0 z-0"
                style={{ scale, opacity }}
            >
                <img
                    src="https://images.unsplash.com/photo-1622552181249-1b143715563d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Modern heavy-duty truck at dusk"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10 p-6"
            >
                <div className="bg-black/30 backdrop-blur-md p-10 rounded-xl border border-white/10">
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4 tracking-tight leading-tight">
                       The Backbone of Your Fleet.<br /> Since <span className="text-[#FFC857]">1976.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80 mb-8">
                        Vijayawada's most trusted source for advanced heavy vehicle body solutions for TATA, Ashok Leyland, and Bharat Benz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#legacy" className="px-8 py-3 bg-[#00A89D] text-[#0B1726] rounded-full font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105">
                            Explore Our Legacy
                        </a>
                        <a href="#contact" className="px-8 py-3 border-2 border-white/80 text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                            Connect With Us
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

// Legacy Section Component
const LegacySection = () => {
    const timeline = [
        { year: '1976', event: "Founded by Mr. Shabul Hussain ('Vaali Bhai'), establishing a foundation of trust." },
        { year: 'Legacy', event: "Leadership passed to Mr. Abdul Raqeeb, driving modernization and growth." },
        { year: '2003', event: "Pioneered a new market by introducing specialized body parts from Namakkal to Vijayawada." },
        { year: 'Today', event: "Celebrating 50+ years as Autonagar's leading authority in heavy vehicle solutions." },
    ];

    return (
        <section id="legacy" className="py-24 bg-[#0B1726]">
            <div className="container mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold font-heading mb-4"
                >
                    A Journey of <span className="text-[#00A89D]">50+ Years</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg text-[#F6F4F2]/70 max-w-2xl mx-auto mb-16"
                >
                    From a visionary start to an industry benchmark, our commitment to quality and trust has been unwavering.
                </motion.p>
                <div className="relative">
                     <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#FFC857]/30 transform -translate-x-1/2"></div>
                     <div className="space-y-16">
                        {timeline.map((item, index) => (
                             <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="relative flex items-center"
                            >
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                    <div className="bg-[#0B1726]/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 shadow-lg">
                                        <h3 className="text-2xl font-bold font-heading text-[#FFC857]">{item.year}</h3>
                                        <p className="text-[#F6F4F2]/80 mt-2">{item.event}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#FFC857] rounded-full border-4 border-[#0B1726]"></div>
                                <div className={`w-1/2 ${index % 2 !== 0 ? 'pr-8' : 'pl-8'}`}></div>
                            </motion.div>
                        ))}
                     </div>
                </div>
            </div>
        </section>
    );
};

// Metrics Section Component
const AnimatedCounter = ({ value, label }) => {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = parseInt(value.replace(/\D/g, ""));
            if (start === end) return;
            
            const duration = 2000;
            // Avoid division by zero
            const incrementTime = end > 0 ? (duration / end) : 0;
            
            if (incrementTime > 0) {
                const timer = setInterval(() => {
                    start += 1;
                    setCount(start);
                    if (start >= end) clearInterval(timer);
                }, incrementTime);
                 return () => clearInterval(timer);
            } else {
                 setCount(end);
            }
        }
    }, [inView, value]);

    return (
        <div className="text-center" ref={ref}>
            <p className="text-6xl font-bold font-heading text-[#FFC857]">
                {count}{value.includes('+') ? '+' : ''}
            </p>
            <p className="text-lg text-[#F6F4F2]/70 mt-2">{label}</p>
        </div>
    );
};

const MetricsSection = () => {
    const metrics = [
        { value: '50+', label: 'Years of Trust' },
        { value: '15+', label: 'Leading Brands Partnered' },
        { value: '100+', label: 'Businesses & Fleets Served' },
        { value: '3', label: 'Generations of Expertise' },
    ];

    return (
        <section className="py-20 bg-[#0B1726] border-y border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {metrics.map((metric, index) => (
                        <AnimatedCounter key={index} value={metric.value} label={metric.label} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Capabilities Section Component
const CapabilitiesSection = () => {
    const capabilities = [
        { icon: <Building className="w-10 h-10 text-[#FFC857]" />, title: 'Cabin & Structural Systems', description: 'Supplying complete cabin frames, interiors, and structural components for body building and restoration.' },
        { icon: <HardHat className="w-10 h-10 text-[#FFC857]" />, title: 'Outer Body & Aerodynamics', description: 'A curated selection of genuine and bespoke outer body parts to enhance vehicle functionality and appearance.' },
        { icon: <Award className="w-10 h-10 text-[#FFC857]" />, title: 'Precision Fuel & Control', description: 'Providing robust fuel tanks, advanced dashboards, and integrated control systems for leading heavy vehicle brands.' },
    ];

    return (
        <section id="capabilities" className="py-24 bg-[#0B1726]/90">
            <div className="container mx-auto px-6 text-center">
                 <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold font-heading mb-4"
                >
                    Core Capabilities
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg text-[#F6F4F2]/70 max-w-2xl mx-auto mb-16"
                >
                    Delivering a comprehensive range of solutions to meet the demands of modern fleets.
                </motion.p>
                <div className="grid md:grid-cols-3 gap-8">
                    {capabilities.map((cap, index) => (
                         <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="bg-black/20 backdrop-blur-sm p-8 rounded-lg border border-white/10 shadow-lg hover:border-[#FFC857]/50 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="mb-6 inline-block p-4 rounded-full bg-[#FFC857]/10">{cap.icon}</div>
                            <h3 className="text-2xl font-bold font-heading mb-4">{cap.title}</h3>
                            <p className="text-[#F6F4F2]/70">{cap.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Partners Section Component
const PartnersSection = () => {
    const logos = [
        'https://placehold.co/200x100/FFFFFF/0B1726?text=TATA',
        'https://placehold.co/200x100/FFFFFF/0B1726?text=Ashok+Leyland',
        'https://placehold.co/200x100/FFFFFF/0B1726?text=Bharat+Benz',
        'https://placehold.co/200x100/FFFFFF/0B1726?text=Minda',
        'https://placehold.co/200x100/FFFFFF/0B1726?text=CI+Automotive',
    ];
    const extendedLogos = [...logos, ...logos];

    return (
        <section id="partners" className="py-20 bg-[#0B1726] border-y border-white/10 overflow-hidden">
             <div className="container mx-auto px-6 text-center">
                 <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7 }}
                     className="text-lg text-[#F6F4F2]/70 mb-8"
                 >
                     Trusted by the best in the industry
                 </motion.h3>
                 <div className="relative">
                     <div className="flex animate-scroll">
                         {extendedLogos.map((logo, index) => (
                             <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
                                 <img src={logo} alt={`Partner logo ${index + 1}`} className="h-12 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </section>
    );
};


// FIXED Contact Section Component
const ContactSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, title: '', description: '' });
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: ''
    });

    // Custom Toast functionality
    const showToast = (title, description) => {
        setToast({ show: true, title, description });
        setTimeout(() => {
            setToast({ show: false, title: '', description: '' });
        }, 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        showToast("Message Sent Successfully!", "Thank you for your inquiry. We'll get back to you within 24 hours.");
        
        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            message: ''
        });
        setIsSubmitting(false);
    };

    const contactDetails = [
        { icon: <Phone className="w-5 h-5" />, title: 'Call Us Directly', details: ['+91 888-567-3388 (Mr. Abdul Raqeeb)', '+91 905-297-2421 (Mr. Abdul Aleem, Manager)'] },
        { icon: <Mail className="w-5 h-5" />, title: 'Email Support', details: ['razzaqautomotives.vij@gmail.com', 'Quick response within 4 hours'] }
    ];

    return (
        <section id="contact" className="py-24 bg-[#0B1726]/95 relative">
             {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-5 right-5 z-50 bg-[#00A89D] text-white p-4 rounded-lg shadow-lg animate-fade-in-down">
                    <p className="font-bold">{toast.title}</p>
                    <p className="text-sm">{toast.description}</p>
                </div>
            )}
            <div className="container mx-auto px-6">
                <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        Let's Build Your <span className="text-[#00A89D]">Success Together</span>
                    </h2>
                    <p className="text-lg text-[#F6F4F2]/70 max-w-3xl mx-auto leading-relaxed">
                        Ready to experience five decades of automotive excellence? Get in touch with our team for expert consultation and premium heavy vehicle solutions.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-3">
                        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg border border-white/10 shadow-lg">
                            <h3 className="text-2xl font-bold font-heading mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" required className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A89D] transition-all" />
                                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A89D] transition-all" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address *" required className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A89D] transition-all" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number *" required className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A89D] transition-all" />
                                </div>
                                <div>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message *" required rows="5" className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A89D] transition-all resize-none"></textarea>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center py-4 px-6 bg-[#00A89D] text-[#0B1726] rounded-full font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Send className="w-5 h-5 mr-2" />
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                    
                    {/* Contact Info Cards */}
                     <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="lg:col-span-2 space-y-6">
                        {contactDetails.map((detail, index) => (
                            <div key={index} className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-white/10 shadow-lg flex items-start space-x-4">
                               <div className="flex-shrink-0 w-12 h-12 bg-[#FFC857]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#FFC857]">{detail.icon}</span>
                               </div>
                               <div>
                                   <h4 className="font-bold font-heading mb-1">{detail.title}</h4>
                                   {detail.details.map((line, i) => <p key={i} className="text-sm text-[#F6F4F2]/70">{line}</p>)}
                               </div>
                            </div>
                        ))}
                         <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-white/10 shadow-lg flex items-start space-x-4">
                               <div className="flex-shrink-0 w-12 h-12 bg-[#FFC857]/10 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-[#FFC857]" />
                               </div>
                               <div>
                                   <h4 className="font-bold font-heading mb-1">Opening Hours</h4>
                                   <p className="text-sm text-[#F6F4F2]/70">Mon-Sat: 9:00am - 8:30pm</p>
                                   <p className="text-sm text-[#F6F4F2]/70">Sun: 9:00am - 1:30pm</p>
                               </div>
                            </div>
                    </motion.div>
                </div>
                
                 {/* Map Section */}
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16">
                     <div className="text-center mb-6">
                         <p className="inline-flex items-center text-[#F6F4F2]/80"><MapPin className="w-4 h-4 mr-2"/>Razzaq Automotives, 3rd Cross Road, Auto Nagar, Vijayawada</p>
                     </div>
                     <div className="h-96 rounded-lg overflow-hidden border border-white/10 shadow-xl">
                         <iframe
                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.419016847346!2d80.61823507532998!3d16.505406484132817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d4c93%3A0x65965501d5bc3c4a!2sRazzaq%20Automotives!5e0!3m2!1sen!2sin!4v1732567890123!5m2!1sen!2sin"
                             width="100%"
                             height="100%"
                             style={{ border: 0, filter: 'invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.1)' }}
                             allowFullScreen=""
                             loading="lazy"
                             referrerPolicy="no-referrer-when-downgrade"
                             title="Razzaq Automotives Location"
                         ></iframe>
                     </div>
                 </motion.div>
            </div>
        </section>
    );
};


// Footer Component
const Footer = () => {
    return (
        <footer className="bg-black/30 border-t border-white/10 py-12">
            <div className="container mx-auto px-6 text-center text-[#F6F4F2]/60">
                <p className="text-lg font-bold font-heading mb-2">Razzaq Automotives</p>
                <p className="mb-4">Powering Progress Since 1976</p>
                <p className="text-sm">&copy; {new Date().getFullYear()} Razzaq Automotives. All Rights Reserved. Designed with Vision.</p>
            </div>
        </footer>
    );
};

export default App;

