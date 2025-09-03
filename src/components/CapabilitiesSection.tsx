import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Truck, Settings, Zap } from 'lucide-react';
import warehouseInterior from '@/assets/warehouse-interior.jpg';
import truckInterior from '@/assets/truck-interior.jpg';

const CapabilitiesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const capabilities = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Cabin & Structural Systems',
      description: 'Supplying complete cabin frames, interiors, and structural components for body building and restoration projects.',
      features: ['Complete Cabin Frames', 'Interior Systems', 'Structural Components', 'Restoration Parts'],
      image: truckInterior
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Outer Body & Aerodynamics',
      description: 'A curated selection of genuine and bespoke outer body parts to enhance vehicle functionality and appearance.',
      features: ['Body Panels', 'Aerodynamic Components', 'Custom Fabrication', 'Aesthetic Enhancements'],
      image: warehouseInterior
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fuel & Electrical Systems',
      description: 'Providing robust fuel tanks, dashboards, and related systems for leading heavy vehicle brands.',
      features: ['Fuel Tank Systems', 'Dashboard Components', 'Electrical Harnesses', 'Control Systems'],
      image: warehouseInterior
    }
  ];

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

        <div className="grid lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="card-premium h-full">
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
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            {['TATA Motors', 'Ashok Leyland', 'Bharat Benz', 'Mahindra'].map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="px-6 py-3 border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;