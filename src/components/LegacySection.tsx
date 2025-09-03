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
      year: '1990s',
      title: 'Leadership Evolution', 
      description: 'Leadership passed to Mr. Abdul Raqeeb, driving modernization and strategic growth in the automotive sector.',
      icon: <Users className="w-6 h-6" />,
      stats: 'New Leadership'
    },
    {
      year: '2003',
      title: 'Market Pioneer',
      description: 'Pioneered a new market by introducing specialized body parts from Namakkal to Vijayawada, revolutionizing local supply chains.',
      icon: <TrendingUp className="w-6 h-6" />,
      stats: 'Market Innovation'
    },
    {
      year: 'Today',
      title: 'Industry Benchmark',
      description: 'Celebrating 50+ years as Autonagar\'s leading authority in heavy vehicle solutions, serving major fleets across Andhra Pradesh.',
      icon: <Award className="w-6 h-6" />,
      stats: '50+ Years Strong'
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
            From a Vision in <span className="text-accent">1976</span> to an Industry Benchmark
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our journey spans five decades of innovation, trust, and excellence in heavy vehicle solutions, 
            building lasting partnerships with industry leaders.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Content Card */}
              <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                <div className="card-premium">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mr-4">
                      <span className="text-primary-foreground">
                        {event.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-semibold text-accent">
                        {event.year}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.stats}
                      </p>
                    </div>
                  </div>
                  <h4 className="text-xl font-heading font-semibold mb-3">
                    {event.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background shadow-glow" />

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
            { number: '50+', label: 'Years of Experience' },
            { number: '1976', label: 'Year Established' },
            { number: '1000+', label: 'Clients Served' },
            { number: '3', label: 'Generation Legacy' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="text-4xl lg:text-5xl font-heading font-bold text-accent mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LegacySection;