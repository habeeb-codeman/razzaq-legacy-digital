import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTreasureHunt } from '@/hooks/useTreasureHunt';

interface GalleryItem {
  filename: string;
  product_name: string;
  description: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateProgress } = useTreasureHunt();

  // Secret sparkle effect on random image
  const [secretImageIndex] = useState(() => 
    Math.floor(Math.random() * 12) // Random image in first 12
  );

  useEffect(() => {
    fetch('/images/gallery/gallery.json')
      .then(res => res.json())
      .then(data => {
        setGalleryItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading gallery:', error);
        setLoading(false);
      });
  }, []);

  const handleSecretImageClick = () => {
    updateProgress('clue3');
  };

  const handleWhatsAppInquiry = (item: GalleryItem) => {
    const phone = '+919876543210'; // Default company phone
    const message = `Hello Razzaq Automotives — I'm interested in "${item.product_name}" from your gallery. Please share details & availability.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Product Gallery - 50 Years of Quality Parts | Razzaq Automotives"
        description="Browse our extensive collection of TATA, Ashok Leyland & Bharat Benz truck parts. Over 50 years of experience in heavy vehicle components across Vijayawada and Andhra Pradesh."
        keywords="truck parts gallery, heavy vehicle parts showcase, TATA parts collection, Ashok Leyland components, truck body parts photos"
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Product Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our extensive collection of quality heavy vehicle parts and components
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {galleryItems.map((item, index) => {
                const isSecretImage = index === secretImageIndex;
                return (
                  <motion.div
                    key={item.filename}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col ${
                        isSecretImage ? 'ring-2 ring-accent/30 hover:ring-accent/50' : ''
                      }`}
                    >
                      <div 
                        className="aspect-square overflow-hidden bg-muted relative"
                        onClick={isSecretImage ? handleSecretImageClick : undefined}
                      >
                        {isSecretImage && (
                          <>
                            <div className="absolute top-2 right-2 z-10 text-2xl animate-bounce">
                              ✨
                            </div>
                            <div className="absolute bottom-2 left-2 z-10 text-xl animate-pulse">
                              ✨
                            </div>
                            <motion.div
                              animate={{
                                boxShadow: [
                                  '0 0 20px rgba(var(--accent-rgb), 0.3)',
                                  '0 0 40px rgba(var(--accent-rgb), 0.6)',
                                  '0 0 20px rgba(var(--accent-rgb), 0.3)',
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                              className="absolute inset-0 pointer-events-none"
                            />
                          </>
                        )}
                        <img
                          src={`/images/gallery/${item.filename}`}
                          alt={item.product_name}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            isSecretImage ? 'cursor-pointer group-hover:scale-110' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                          {item.description}
                        </p>
                        <Button
                          onClick={() => handleWhatsAppInquiry(item)}
                          className="btn-hero w-full"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Inquire on WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-3">Need a Specific Part?</h2>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Contact us directly and our experienced team will help you find the right parts for your vehicle.
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
