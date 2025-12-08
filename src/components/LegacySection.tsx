import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Users, Award, TrendingUp } from 'lucide-react';

const LegacySection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const timelineEvents = [
    {
      year: '1976',
      title: 'Foundation of Excellence',
      description: 'Founded by Mr. Shabul Hussain (\'Vaali Bhai\'), establishing a foundation of trust and quality in heavy vehicle solutions.',
      icon: <Calendar className="w-6 h-6" />,
      stats: 'Birth of a Vision'
    },
    {
      year: '2003',
      title: 'Leadership Evolution & Market Pioneer', 
      description: 'Leadership passed to Mr. Abdul Raqeeb, who pioneered introducing specialized body parts from Namakkal to Vijayawada, revolutionizing local supply chains.',
      icon: <Users className="w-6 h-6" />,
      stats: 'New Leadership & Innovation'
    },
    {
      year: '2024-2026',
      title: 'Golden Jubilee Approaching',
      description: 'As we approach our 50th anniversary in 2026, we celebrate nearly five decades as Autonagar\'s leading authority in heavy vehicle solutions, serving major fleets across Andhra Pradesh with unwavering commitment.',
      icon: <Award className="w-6 h-6" />,
      stats: 'Golden Jubilee - 50 Years in 2026'
    }
  ];

  return (
    <section id="legacy" className="py-24 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            From a Vision in <span className="text-accent">1976</span> to 50 Years in <span className="text-accent">2026</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            As we approach our Golden Jubilee in 2026, we celebrate nearly five decades of innovation, 
            trust, and excellence in heavy vehicle solutions, building lasting partnerships with industry leaders.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.95 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.3, type: "spring", bounce: 0.3 }}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Content Card - Enhanced */}
              <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                <motion.div 
                  className="glass-card group hover:border-accent/50 transition-all duration-500"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl mr-4 shadow-lg group-hover:shadow-glow transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-primary-foreground">
                        {event.icon}
                      </span>
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-heading font-bold text-accent group-hover:text-primary transition-colors">
                        {event.year}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {event.stats}
                      </p>
                    </div>
                  </div>
                  <h4 className="text-xl font-heading font-semibold mb-3 group-hover:text-accent transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </div>

              {/* Timeline Node - Enhanced */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-accent rounded-full border-4 border-background shadow-glow z-10"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.3 + 0.2, type: "spring", bounce: 0.5 }}
              />

              {/* Spacer for opposite side */}
              <div className="hidden lg:block w-5/12" />
            </motion.div>
          ))}
        </div>

        {/* Legacy Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: '50+', label: 'Years of Excellence' },
            { number: '500+', label: 'Fleet Partners' },
            { number: '10K+', label: 'Parts Delivered' },
            { number: '4', label: 'Warehouse Locations' }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <div className="text-4xl lg:text-5xl font-heading font-bold text-accent mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LegacySection;