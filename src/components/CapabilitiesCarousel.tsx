import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import { 
  Truck, Settings, Zap, Wind, Car, Armchair, 
  Eye, DoorOpen, Cpu, CircleDot 
} from 'lucide-react';
import warehouseInterior from '@/assets/warehouse-interior.jpg';
import truckInterior from '@/assets/truck-interior.jpg';
import electricalSystems from '@/assets/electrical-systems.jpg';

const CapabilitiesCarousel = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const capabilities = [
    {
      icon: <Truck className="w-7 h-7" />,
      title: 'Cabin & Structural Systems',
      description: 'Complete cabin frames, interiors, and structural components for body building and restoration.',
      features: ['Complete Cabin Frames', 'Interior Systems', 'Structural Components'],
      image: truckInterior,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Settings className="w-7 h-7" />,
      title: 'Outer Body & Aerodynamics',
      description: 'Genuine and bespoke outer body parts to enhance vehicle functionality and appearance.',
      features: ['Body Panels', 'Aerodynamic Components', 'Custom Fabrication'],
      image: warehouseInterior,
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Fuel & Electrical Systems',
      description: 'Robust fuel tanks, dashboards, and electrical systems for leading heavy vehicle brands.',
      features: ['Fuel Tank Systems', 'Dashboard Components', 'Electrical Harnesses'],
      image: electricalSystems,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Wind className="w-7 h-7" />,
      title: 'Engine Air Filtration',
      description: 'High-performance air filtration systems ensuring optimal engine performance and longevity.',
      features: ['Air Filter Assemblies', 'Intake Systems', 'Dust Separators'],
      image: warehouseInterior,
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <Car className="w-7 h-7" />,
      title: 'Original Body Parts',
      description: 'Ashok Leyland and TATA original dashboards, outer body panels, and structural components.',
      features: ['Original Dashboards', 'Body Panels', 'Bumpers & Grilles'],
      image: truckInterior,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Armchair className="w-7 h-7" />,
      title: 'Seats & Interior',
      description: 'Premium quality seats and interior components for driver comfort and cabin aesthetics.',
      features: ['Driver Seats', 'Passenger Seats', 'Seat Covers'],
      image: electricalSystems,
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <Eye className="w-7 h-7" />,
      title: 'Mirrors & Visibility',
      description: 'Rear view mirrors and visibility accessories for safety and compliance standards.',
      features: ['Side Mirrors', 'Rear View Mirrors', 'Mirror Assemblies'],
      image: warehouseInterior,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <DoorOpen className="w-7 h-7" />,
      title: 'Doors & Panels',
      description: 'Complete door assemblies and panels with perfect fitment for all major truck brands.',
      features: ['Door Assemblies', 'Door Panels', 'Hinges & Handles'],
      image: truckInterior,
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: 'Sensors & Electronics',
      description: 'Modern sensors and electronic components for enhanced vehicle performance and diagnostics.',
      features: ['Speed Sensors', 'Pressure Sensors', 'Control Units'],
      image: electricalSystems,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <CircleDot className="w-7 h-7" />,
      title: 'Suspensions & Chassis',
      description: 'Heavy-duty suspension systems and chassis components for durability and load handling.',
      features: ['Leaf Springs', 'Shock Absorbers', 'Chassis Parts'],
      image: warehouseInterior,
      gradient: 'from-accent/20 to-accent/5'
    }
  ];

  // Duplicate items for infinite scroll effect
  const duplicatedCapabilities = [...capabilities, ...capabilities];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !inView) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        const maxScroll = scrollContainer.scrollWidth / 2;
        
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [inView, isPaused]);

  return (
    <section id="capabilities" className="py-24 bg-gradient-to-b from-background to-card/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-section-title mb-6">
            Comprehensive Solutions for <span className="text-primary">Modern Fleets</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From cabin systems to suspension components, we provide complete heavy vehicle solutions 
            meeting the highest standards of quality and reliability.
          </p>
        </motion.div>
      </div>

      {/* Scrolling Carousel */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden py-4 px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedCapabilities.map((capability, index) => (
            <motion.div
              key={`${capability.title}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
              className="flex-shrink-0 w-[320px] group"
            >
              <div className={`glass-card h-full bg-gradient-to-br ${capability.gradient} hover:scale-[1.02] transition-all duration-500`}>
                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-lg">
                    <span className="text-primary-foreground">
                      {capability.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors leading-tight">
                    {capability.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {capability.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Brand Compatibility */}
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
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
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-6 py-3 glass-card cursor-pointer"
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
