import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      role: 'Fleet Manager',
      content: 'Working with Razzaq Automotives for over 15 years has been exceptional. Their parts quality is unmatched, and the service is always prompt. They understand the urgency of keeping our fleet running.',
      rating: 5,
      image: '🚛'
    },
    {
      role: 'Truck Owner',
      content: 'The expertise and reliability of Razzaq Automotives is outstanding. They have genuine parts in stock and their technical knowledge helps us maintain our trucks in top condition. Truly a trusted partner.',
      rating: 5,
      image: '🔧'
    },
    {
      role: 'Mechanic',
      content: 'From body parts to electrical systems, Razzaq has everything we need under one roof. Their pricing is competitive and the quality is consistently excellent. We recommend them to all our industry contacts.',
      rating: 5,
      image: '⭐'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-card/20 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.05 } : {}}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center mb-16">
            <motion.h2 
              className="text-section-title mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Trusted by <span className="text-accent">Industry Leaders</span>
            </motion.h2>
            <motion.div 
              className="industrial-line w-24 mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Don't just take our word for it. Here's what our long-term partners say about 
              our service, quality, and commitment to excellence over the past 50 years.
            </motion.p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                transition: { duration: 0.3 } 
              }}
              className="frosted-glass group hover:shadow-glow transition-all duration-300"
            >
              {/* Quote Icon */}
              <motion.div 
                className="flex justify-between items-start mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Quote className="w-10 h-10 text-accent/30 group-hover:text-accent/50 group-hover:scale-110 transition-all duration-300" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.1 + i * 0.05 }}
                    >
                      <Star className="w-4 h-4 fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Content */}
              <motion.p 
                className="text-foreground/90 leading-relaxed mb-6 min-h-[120px]"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                "{testimonial.content}"
              </motion.p>

              {/* Author */}
              <motion.div 
                className="flex items-center gap-4 pt-4 border-t border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-2xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {testimonial.image}
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={0.6}>
          <motion.div
            className="text-center mt-16"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-lg text-muted-foreground mb-6">
              Join hundreds of satisfied customers who trust us with their heavy vehicle needs
            </p>
            <motion.a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md btn-accent px-8 py-4 text-base font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Become Our Next Success Story
            </motion.a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
