import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Calendar, Users, Award, TrendingUp, Factory, Truck, MapPin, Building2, Trophy, Star } from 'lucide-react';

const Timeline = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const milestones = [
    {
      year: '1976',
      title: 'Foundation of Excellence',
      description: 'Mr. Shabul Hussain (\'Vaali Bhai\') founded Razzaq Automotives with a vision to revolutionize heavy vehicle solutions in Vijayawada. Starting with a small workshop, we set the foundation for what would become the region\'s most trusted automotive parts supplier.',
      icon: <Calendar className="w-6 h-6" />,
      category: 'Foundation',
      highlights: ['First workshop established', 'Initial TATA parts dealership', 'Foundation of trust']
    },
    {
      year: '1980s',
      title: 'Expansion & Growth',
      description: 'Expanded operations to serve multiple vehicle manufacturers. Established strong relationships with TATA Motors and began building our reputation for quality and reliability across Andhra Pradesh.',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'Growth',
      highlights: ['Multi-brand operations', 'Regional expansion', 'Quality reputation built']
    },
    {
      year: '1990s',
      title: 'Industry Recognition',
      description: 'Became the go-to supplier for major fleet operators in the region. Introduced advanced diagnostic services and expanded our parts inventory to cover comprehensive heavy vehicle needs.',
      icon: <Award className="w-6 h-6" />,
      category: 'Recognition',
      highlights: ['Major fleet partnerships', 'Advanced services', 'Inventory expansion']
    },
    {
      year: '2003',
      title: 'Leadership Evolution & Innovation',
      description: 'Mr. Abdul Raqeeb took the helm, bringing fresh vision and innovation. Pioneered the introduction of specialized body parts from Namakkal to Vijayawada, revolutionizing the local supply chain and reducing delivery times significantly.',
      icon: <Users className="w-6 h-6" />,
      category: 'Innovation',
      highlights: ['New leadership', 'Supply chain revolution', 'Namakkal connection established']
    },
    {
      year: '2010s',
      title: 'Multi-Location Presence',
      description: 'Established three strategic locations across Vijayawada, ensuring comprehensive coverage and faster service. Added Ashok Leyland and Bharat Benz to our portfolio, becoming a one-stop solution for all major truck brands.',
      icon: <MapPin className="w-6 h-6" />,
      category: 'Expansion',
      highlights: ['Three locations', 'Multi-brand portfolio', 'Enhanced service coverage']
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Embraced modern technology with digital inventory management and customer service systems. Maintained operations through challenging times, proving our commitment to customer service.',
      icon: <Building2 className="w-6 h-6" />,
      category: 'Modernization',
      highlights: ['Digital systems', 'Online presence', 'Modern inventory management']
    },
    {
      year: '2024',
      title: 'Industry Benchmark',
      description: 'Celebrating 48 years of excellence as Autonagar\'s leading authority in heavy vehicle solutions. Serving 100+ businesses and thousands of customers with an unmatched range of parts and services.',
      icon: <Trophy className="w-6 h-6" />,
      category: 'Present',
      highlights: ['48+ years strong', '100+ fleet partnerships', 'Industry leader']
    },
    {
      year: '2026',
      title: 'Golden Jubilee - 50 Years',
      description: 'Approaching our 50th anniversary milestone in 2026! Half a century of trust, quality, and innovation. We continue to set new standards in the industry while honoring the legacy of our founders.',
      icon: <Star className="w-6 h-6" />,
      category: 'Future',
      highlights: ['50-year milestone', 'Golden jubilee celebration', 'Legacy continues']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="50 Years Journey - Company Timeline | Razzaq Automotives"
        description="Discover the remarkable 50-year journey of Razzaq Automotives from 1976 to 2026. Milestones, achievements, and growth story of Vijayawada's leading heavy vehicle parts supplier."
        keywords="company history, 50 years anniversary, Razzaq timeline, automotive legacy, Vijayawada heritage, business milestones"
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
                <span className="text-accent font-semibold">1976 - 2026</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-foreground">50 Years of Excellence</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our Journey Through <span className="text-accent">Time</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Five decades of innovation, trust, and excellence in heavy vehicle solutions. 
                From a small workshop to the region's industry benchmark, this is our story.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="container mx-auto px-4 py-16">
          <div className="relative max-w-6xl mx-auto" ref={ref}>
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform md:-translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center mb-20 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="glass-card group hover:shadow-glow transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <span className="text-primary-foreground">
                          {milestone.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-heading font-bold text-accent">
                          {milestone.year}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {milestone.category}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-2xl font-heading font-semibold mb-3">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {milestone.description}
                    </p>
                    <div className="space-y-2">
                      {milestone.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                          <span className="text-foreground/80">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-accent rounded-full border-4 border-background shadow-glow transform md:-translate-x-1/2" />

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="frosted-glass rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of Our <span className="text-accent">Next Chapter</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              As we approach our 50th anniversary in 2026, we invite you to experience 
              the quality and service that has made us an industry leader for five decades.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition-opacity shadow-elegant"
            >
              Connect With Us Today
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Timeline;
