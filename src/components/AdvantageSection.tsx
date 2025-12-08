import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Package, Smartphone } from 'lucide-react';

const AdvantageSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const advantages = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Unrivaled Expertise',
      description: 'Leverage our 50+ years of specialized knowledge to find the perfect solution for your fleet requirements.',
      benefits: [
        'Five decades of industry experience',
        'Deep understanding of heavy vehicle mechanics',
        'Expert consultation and guidance',
        'Proven track record of success'
      ],
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Curated Selection',
      description: 'Access a superior range of both genuine OEM and high-quality third-party parts curated for performance.',
      benefits: [
        'Extensive inventory of premium parts',
        'Both OEM and aftermarket options',
        'Quality-tested components only',
        'Comprehensive compatibility coverage'
      ],
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Modern Service',
      description: 'Experience seamless B2B transactions with our efficient digital billing and procurement solutions.',
      benefits: [
        'Digital billing and invoicing',
        'Streamlined procurement process',
        'Real-time inventory updates',
        'Professional customer support'
      ],
      gradient: 'from-secondary/20 to-secondary/5'
    }
  ];

  return (
    <section id="advantage" className="py-24 bg-card/10">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            The Difference is Our <span className="text-primary">Dedication</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            What sets Razzaq Automotives apart is our unwavering commitment to excellence, 
            innovation, and customer satisfaction in every aspect of our service.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: -10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="card-premium h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                
                {/* Animated Background Shapes */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-6 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-primary-foreground">
                      {advantage.icon}
                    </span>
                  </motion.div>

                  {/* Title and Description */}
                  <h3 className="text-2xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {advantage.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    {advantage.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefitIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.2 + benefitIndex * 0.1 }}
                        className="flex items-start group/item"
                      >
                        <motion.div 
                          className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"
                          whileHover={{ scale: 1.5 }}
                        />
                        <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1, type: "spring" }}
          className="text-center mt-16"
        >
          <motion.div 
            className="card-hero max-w-2xl mx-auto relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-semibold mb-4">
                Ready to Experience the Razzaq Advantage?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join hundreds of satisfied clients who trust us with their heavy vehicle needs. 
                Let's discuss how we can support your fleet requirements.
              </p>
              <motion.button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-hero px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Today
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvantageSection;