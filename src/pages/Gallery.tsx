import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

// Import your images here - add more as needed
import heroTruck from '@/assets/hero-truck.jpg';
import heroTruckCinematic from '@/assets/hero-truck-cinematic.jpg';
import truckInterior from '@/assets/truck-interior.jpg';
import warehouseInterior from '@/assets/warehouse-interior.jpg';
import electricalSystems from '@/assets/electrical-systems.jpg';
import abstractIndustrial from '@/assets/abstract-industrial.jpg';

// Configure your gallery images here
const galleryImages = [
  {
    src: heroTruck,
    alt: "Heavy duty truck body manufacturing",
    title: "Premium Truck Bodies"
  },
  {
    src: heroTruckCinematic,
    alt: "Cinematic view of commercial vehicle",
    title: "Commercial Vehicle Solutions"
  },
  {
    src: truckInterior,
    alt: "Advanced truck cabin interior",
    title: "Cabin Interior Systems"
  },
  {
    src: warehouseInterior,
    alt: "Modern automotive warehouse facility",
    title: "State-of-the-Art Facility"
  },
  {
    src: electricalSystems,
    alt: "Advanced electrical systems for vehicles",
    title: "Electrical Systems"
  },
  {
    src: abstractIndustrial,
    alt: "Industrial automotive components",
    title: "Quality Components"
  }
];

const Gallery = () => {
  return (
    <>
      <SEO 
        title="Gallery | Razzaq Automotives"
        description="Explore our gallery showcasing premium heavy vehicle solutions, truck body parts, and state-of-the-art automotive facilities. See the quality that has made us Vijayawada's trusted choice since 1976."
        keywords="truck body gallery, automotive parts showcase, heavy vehicle solutions, Razzaq Automotives gallery, truck manufacturing photos"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="heading-primary mb-6">Our Gallery</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the quality and craftsmanship that has made Razzaq Automotives 
                Vijayawada's premier choice for heavy vehicle solutions since 1976.
              </p>
            </motion.div>
          </section>

          {/* Gallery Grid */}
          <section className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg bg-card border border-border/20 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {image.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Add More Images Instructions */}
          <section className="container mx-auto px-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border/20 rounded-lg p-8 text-center"
            >
              <h2 className="text-xl font-semibold mb-4">Add More Images</h2>
              <p className="text-muted-foreground mb-4">
                To add more images to the gallery, simply:
              </p>
              <ol className="text-left text-sm text-muted-foreground max-w-md mx-auto space-y-2">
                <li>1. Add your images to the <code className="bg-muted px-2 py-1 rounded text-xs">src/assets/</code> folder</li>
                <li>2. Import them at the top of <code className="bg-muted px-2 py-1 rounded text-xs">src/pages/Gallery.tsx</code></li>
                <li>3. Add them to the <code className="bg-muted px-2 py-1 rounded text-xs">galleryImages</code> array</li>
              </ol>
            </motion.div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Gallery;