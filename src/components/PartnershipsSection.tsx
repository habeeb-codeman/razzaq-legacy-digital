import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PartnershipsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const partners = [
    'TATA Motors',
    'Ashok Leyland',
    'Bharat Benz',
    'CI Automotive Solutions',
    'Minda Group',
    'Mahindra Group',
    'Force Motors',
    'Bajaj Auto'
  ];

  // Duplicate for infinite scroll effect
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partnerships" className="py-24 bg-gradient-to-b from-background to-card/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            Built on a Network of <span className="text-accent">Excellence</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our strategic partnerships with industry leaders ensure access to genuine parts 
            and cutting-edge automotive technologies.
          </p>
        </motion.div>

        {/* Infinite Scrolling Logo Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="flex space-x-8 animate-scroll-horizontal">
            {duplicatedPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + (index % partners.length) * 0.1 }}
                className="flex-shrink-0 group"
              >
                <div className="flex items-center justify-center h-24 px-8 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg hover:border-primary/50 hover:bg-card/80 transition-all duration-300 group-hover:shadow-glow">
                  <span className="text-lg font-heading font-semibold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                    {partner}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </motion.div>

        {/* Partnership Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              title: 'Genuine Parts',
              description: 'Direct access to OEM-quality components from authorized suppliers',
              stat: '100%',
              icon: '✓'
            },
            {
              title: 'Quality Assurance',
              description: 'All parts backed by manufacturer warranties and quality certifications',
              stat: 'Certified',
              icon: '★'
            },
            {
              title: 'Technical Support',
              description: 'Expert guidance and technical support from our partner network',
              stat: '24/7',
              icon: '⚙'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="text-center frosted-glass p-6 rounded-xl cursor-pointer group"
            >
              <motion.div 
                className="text-4xl mb-3"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {benefit.icon}
              </motion.div>
              <div className="text-3xl font-heading font-bold text-accent mb-2 group-hover:text-primary transition-colors">
                {benefit.stat}
              </div>
              <h4 className="text-xl font-heading font-semibold mb-3">
                {benefit.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnershipsSection;