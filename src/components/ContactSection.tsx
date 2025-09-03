import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    });

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Visit Our Store',
      details: ['Razzaq Automotives, 3rd Cross Road', 'Auto Nagar, Vijayawada', 'Andhra Pradesh 520007'],
      action: 'Get Directions'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Call Us',
      details: ['+91 888-567-3388 (Mr. Abdul Raqeeb)', '+91 905-297-2421 (Mr. Abdul Aleem, Manager)'],
      action: 'Call Now'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email Us',
      details: ['razzaqautomotives.vij@gmail.com', 'Quick response within 4 hours'],
      action: 'Send Email'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Business Hours',
      details: ['Mon-Sat: 9:00am - 8:30pm', 'Sunday: 9:00am - 1:30pm'],
      action: 'Plan Visit'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-card/10">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section-title mb-6">
            Let's Build Your <span className="text-primary">Success Together</span>
          </h2>
          <div className="industrial-line w-24 mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to experience five decades of automotive excellence? Get in touch with our team 
            for expert consultation and premium heavy vehicle solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card-premium">
              <h3 className="text-2xl font-heading font-semibold mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="Your company name (optional)"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="+91 XXXXX-XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="bg-background/50 border-border/50 focus:border-primary resize-none"
                    placeholder="Tell us about your requirements, fleet details, or any questions you have..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hero w-full py-6 text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {contactDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card-premium group hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary-foreground">
                      {detail.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                      {detail.title}
                    </h4>
                    <div className="space-y-1">
                      {detail.details.map((line, lineIndex) => (
                        <p key={lineIndex} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="card-premium overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Interactive Map</p>
                  <p className="text-xs text-muted-foreground">Auto Nagar, Vijayawada</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;