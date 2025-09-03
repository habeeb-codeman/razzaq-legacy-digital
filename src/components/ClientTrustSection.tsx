import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Truck, Star } from 'lucide-react';

const ClientTrustSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const clients = [
    {
      name: 'My Home Constructions',
      industry: 'Construction & Real Estate',
      description: 'Leading construction company trusting us for their heavy vehicle fleet maintenance and parts supply.',
      icon: <Building2 className="w-6 h-6" />,
      testimonial: 'Reliable partner for our construction vehicle needs'
    },
    {
      name: 'Parthasarathy Transport Private Limited',
      industry: 'Logistics & Transportation',
      description: 'Major transport company relying on our expertise for their extensive fleet operations.',
      icon: <Truck className="w-6 h-6" />,
      testimonial: 'Exceptional service quality and genuine parts'
    }
  ];

  const trustMetrics = [
    { label: 'Client Satisfaction', value: '98%', icon: <Star className="w-5 h-5" /> },
    { label: 'On-Time Delivery', value: '99%', icon: <Truck className="w-5 h-5" /> },
    { label: 'Repeat Customers', value: '95%', icon: <Building2 className="w-5 h-5" /> }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            The Trusted Partner for <span className="text-accent">Industry Leaders</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our commitment to excellence has earned the trust of major corporations 
            across construction, transportation, and industrial sectors.
          </p>
        </motion.div>

        {/* Client Showcase */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className="group"
            >
              <div className="card-premium h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mr-4">
                      <span className="text-primary-foreground">
                        {client.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-sm text-accent">
                        {client.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-current" />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {client.description}
                </p>

                {/* Testimonial */}
                <blockquote className="relative">
                  <div className="absolute top-0 left-0 text-6xl text-accent/20 font-serif">"</div>
                  <p className="text-foreground italic pl-8 relative z-10">
                    {client.testimonial}
                  </p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {trustMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4">
                <span className="text-primary-foreground">
                  {metric.icon}
                </span>
              </div>
              <div className="text-4xl font-heading font-bold text-accent mb-2">
                {metric.value}
              </div>
              <p className="text-muted-foreground font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16"
        >
          <div className="card-hero max-w-3xl mx-auto">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              Join Our Growing Network of Satisfied Clients
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Whether you're managing a construction fleet, transportation business, or industrial operations, 
              we have the expertise and resources to support your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-hero px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Become a Partner
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('capabilities');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-outline-hero px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                View Our Solutions
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientTrustSection;