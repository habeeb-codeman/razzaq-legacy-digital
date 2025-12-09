import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { 
  Truck, Settings, Zap, Wind, Car, Wrench,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import capabilityCabin from '@/assets/capability-cabin.jpg';
import capabilityTransmission from '@/assets/capability-transmission.jpg';
import capabilityCooling from '@/assets/capability-cooling.jpg';
import capabilityAirfilter from '@/assets/capability-airfilter.jpg';
import capabilityBodyparts from '@/assets/capability-bodyparts.jpg';
import capabilityAccessories from '@/assets/capability-accessories.jpg';
import { Button } from '@/components/ui/button';

const CapabilitiesCarousel = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentPage, setCurrentPage] = useState(0);

  const capabilities = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Cabin & Structural Systems',
      description: 'Supplying complete cabin frames, interiors, and structural components for body building and restoration projects.',
      features: ['Complete Cabin Frames', 'Interior Systems', 'Structural Components', 'Restoration Parts'],
      image: capabilityCabin
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Transmission & Drivetrain',
      description: 'A curated selection of genuine and bespoke outer body parts to enhance vehicle functionality and appearance.',
      features: ['Body Panels', 'Aerodynamic Components', 'Custom Fabrication', 'Aesthetic Enhancements'],
      image: capabilityTransmission
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Cooling & Fuel Systems',
      description: 'Providing robust fuel tanks, dashboards, and related systems for leading heavy vehicle brands.',
      features: ['Fuel Tank Systems', 'Dashboard Components', 'Electrical Harnesses', 'Control Systems'],
      image: capabilityCooling
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: 'Engine Air Filtration System',
      description: 'High-performance air filtration systems ensuring optimal engine performance and longevity.',
      features: ['Air Filter Assemblies', 'Intake Systems', 'Dust Separators', 'Filter Elements'],
      image: capabilityAirfilter
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Body Parts',
      description: 'Ashok Leyland and TATA original dashboards, outer body panels, bumpers, and structural components.',
      features: ['Original Dashboards', 'Outer Body Panels', 'Bumpers & Grilles', 'Structural Parts'],
      image: capabilityBodyparts
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Other Parts',
      description: 'Complete range of seats, rear view mirrors, doors, sensors, and suspension components.',
      features: ['Seats & Covers', 'Rear View Mirrors', 'Doors & Panels', 'Sensors & Suspensions'],
      image: capabilityAccessories
    }
  ];

  const pages = [
    capabilities.slice(0, 3),
    capabilities.slice(3, 6)
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <section id="capabilities" className="py-24 bg-card/10">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            Comprehensive Solutions for <span className="text-primary">Modern Fleets</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From cabin systems to fuel infrastructure, we provide complete heavy vehicle solutions 
            that meet the highest standards of quality and reliability.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {pages[currentPage].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-card h-full p-6">
                      {/* Image */}
                      <div className="relative overflow-hidden rounded-lg mb-6">
                        <img 
                          src={capability.image} 
                          alt={`${capability.title} - Razzaq Automotives`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        <div className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg">
                          <span className="text-primary-foreground">
                            {capability.icon}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-heading font-semibold group-hover:text-primary transition-colors">
                          {capability.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {capability.description}
                        </p>

                        {/* Features List */}
                        <div className="space-y-2">
                          {capability.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === index 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Brand Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-heading font-semibold mb-8">
            Compatible with Leading Brands
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {['TATA Motors', 'Ashok Leyland', 'Bharat Benz', 'Mahindra', 'Eicher'].map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-6 py-3 border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
              >
                <span className="font-medium">{brand}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CapabilitiesCarousel;
