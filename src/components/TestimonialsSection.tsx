import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'Kumar Transport Services',
      role: 'Fleet Manager',
      content: 'Working with Razzaq Automotives for over 15 years has been exceptional. Their parts quality is unmatched, and the service is always prompt. They understand the urgency of keeping our fleet running.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Suresh Reddy',
      company: 'Reddy Logistics',
      role: 'Operations Director',
      content: 'The expertise and reliability of Razzaq Automotives is outstanding. They have genuine parts in stock and their technical knowledge helps us maintain our trucks in top condition. Truly a trusted partner.',
      rating: 5,
      image: '👔'
    },
    {
      name: 'Venkat Rao',
      company: 'Rao Brothers Fleet',
      role: 'Owner',
      content: 'From body parts to electrical systems, Razzaq has everything we need under one roof. Their pricing is competitive and the quality is consistently excellent. We recommend them to all our industry contacts.',
      rating: 5,
      image: '🚛'
    },
    {
      name: 'Mohammad Ibrahim',
      company: 'Ibrahim Transport Co.',
      role: 'Managing Partner',
      content: 'Three generations of quality service! We started with their founder and continue today. The commitment to customer satisfaction and genuine parts has never wavered. They are the gold standard in the industry.',
      rating: 5,
      image: '⭐'
    },
    {
      name: 'Satish Naidu',
      company: 'Naidu Cargo Services',
      role: 'Maintenance Head',
      content: 'Their technical team is incredibly knowledgeable about TATA, Ashok Leyland, and Bharat Benz vehicles. They help us source the right parts quickly, minimizing our downtime. Excellent service always!',
      rating: 5,
      image: '🔧'
    },
    {
      name: 'Prakash Singh',
      company: 'Singh Freight Solutions',
      role: 'Owner-Operator',
      content: 'What sets Razzaq apart is their personal attention to each customer. Whether it\'s a small spare part or a major body component, they treat every order with the same care and professionalism.',
      rating: 5,
      image: '👍'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-card/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            Trusted by <span className="text-accent">Industry Leaders</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our long-term partners say about 
            our service, quality, and commitment to excellence over the past 50 years.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="frosted-glass group hover:shadow-glow transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-10 h-10 text-accent/30 group-hover:text-accent/50 transition-colors" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground/90 leading-relaxed mb-6 min-h-[120px]">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-accent font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Join hundreds of satisfied customers who trust us with their heavy vehicle needs
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center rounded-md btn-accent px-8 py-4 text-base font-medium transition-all"
          >
            Become Our Next Success Story
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
