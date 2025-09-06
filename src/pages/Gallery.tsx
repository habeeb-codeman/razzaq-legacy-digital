// import SEO from '@/components/SEO';
// import Navigation from '@/components/Navigation';
// import Footer from '@/components/Footer';
// import { motion } from 'framer-motion';

// // Import your images here - add more as needed
// import heroTruck from '@/assets/hero-truck.jpg';
// import heroTruckCinematic from '@/assets/hero-truck-cinematic.jpg';
// import truckInterior from '@/assets/truck-interior.jpg';
// import warehouseInterior from '@/assets/warehouse-interior.jpg';
// import electricalSystems from '@/assets/electrical-systems.jpg';
// import abstractIndustrial from '@/assets/abstract-industrial.jpg';

// // Configure your gallery images here
// const galleryImages = [
//   {
//     src: heroTruck,
//     alt: "Heavy duty truck body manufacturing",
//     title: "Premium Truck Bodies"
//   },
//   {
//     src: heroTruckCinematic,
//     alt: "Cinematic view of commercial vehicle",
//     title: "Commercial Vehicle Solutions"
//   },
//   {
//     src: truckInterior,
//     alt: "Advanced truck cabin interior",
//     title: "Cabin Interior Systems"
//   },
//   {
//     src: warehouseInterior,
//     alt: "Modern automotive warehouse facility",
//     title: "State-of-the-Art Facility"
//   },
//   {
//     src: electricalSystems,
//     alt: "Advanced electrical systems for vehicles",
//     title: "Electrical Systems"
//   },
//   {
//     src: abstractIndustrial,
//     alt: "Industrial automotive components",
//     title: "Quality Components"
//   }
// ];

// const Gallery = () => {
//   return (
//     <>
//       <SEO 
//         title="Gallery | Razzaq Automotives"
//         description="Explore our gallery showcasing premium heavy vehicle solutions, truck body parts, and state-of-the-art automotive facilities. See the quality that has made us Vijayawada's trusted choice since 1976."
//         keywords="truck body gallery, automotive parts showcase, heavy vehicle solutions, Razzaq Automotives gallery, truck manufacturing photos"
//       />
      
//       <div className="min-h-screen bg-background">
//         <Navigation />
        
//         <main className="pt-24 pb-16">
//           {/* Hero Section */}
//           <section className="container mx-auto px-6 py-16">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <h1 className="heading-primary mb-6">Our Gallery</h1>
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 Discover the quality and craftsmanship that has made Razzaq Automotives 
//                 Vijayawada's premier choice for heavy vehicle solutions since 1976.
//               </p>
//             </motion.div>
//           </section>

//           {/* Gallery Grid */}
//           <section className="container mx-auto px-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {galleryImages.map((image, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className="group relative overflow-hidden rounded-lg bg-card border border-border/20 hover:border-primary/20 transition-all duration-300"
//                 >
//                   <div className="aspect-[4/3] overflow-hidden">
//                     <img
//                       src={image.src}
//                       alt={image.alt}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       loading="lazy"
//                     />
//                   </div>
                  
//                   {/* Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="absolute bottom-0 left-0 right-0 p-6">
//                       <h3 className="text-lg font-semibold text-foreground mb-2">
//                         {image.title}
//                       </h3>
//                       <p className="text-sm text-muted-foreground">
//                         {image.alt}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </section>

//           {/* Add More Images Instructions */}
//           <section className="container mx-auto px-6 mt-16">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="bg-card border border-border/20 rounded-lg p-8 text-center"
//             >
//               <h2 className="text-xl font-semibold mb-4">Add More Images</h2>
//               <p className="text-muted-foreground mb-4">
//                 To add more images to the gallery, simply:
//               </p>
//               <ol className="text-left text-sm text-muted-foreground max-w-md mx-auto space-y-2">
//                 <li>1. Add your images to the <code className="bg-muted px-2 py-1 rounded text-xs">src/assets/</code> folder</li>
//                 <li>2. Import them at the top of <code className="bg-muted px-2 py-1 rounded text-xs">src/pages/Gallery.tsx</code></li>
//                 <li>3. Add them to the <code className="bg-muted px-2 py-1 rounded text-xs">galleryImages</code> array</li>
//               </ol>
//             </motion.div>
//           </section>
//         </main>
        
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Gallery;










// src/pages/Gallery.tsx
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";

// ======= IMPORTANT =======
// Place your gallery-only images in: src/assets/gallery/
// Update the imports below if you use different filenames.
// Only images imported here will appear in the gallery.
import g1 from "@/assets/gallery/gallery-1.jpg";
import g2 from "@/assets/gallery/gallery-2.jpg";
import g3 from "@/assets/gallery/gallery-3.jpg";
import g4 from "@/assets/gallery/gallery-4.jpg";
import g5 from "@/assets/gallery/gallery-5.jpg";
import g6 from "@/assets/gallery/gallery-6.jpg";
// =========================

type GalleryImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

const galleryImages: GalleryImage[] = [
  {
    src: g1,
    alt: "Premium truck body - side profile",
    title: "Premium Truck Bodies",
    caption: "Precision-built truck bodies for heavy-duty performance.",
  },
  {
    src: g2,
    alt: "Cinematic commercial vehicle in workshop",
    title: "Commercial Vehicle Solutions",
    caption: "End-to-end commercial vehicle solutions for fleet owners.",
  },
  {
    src: g3,
    alt: "Truck cabin interior showcasing dashboard and seats",
    title: "Cabin Interior Systems",
    caption: "Comfort-driven cabin interiors with ergonomic design.",
  },
  {
    src: g4,
    alt: "Well-organized warehouse with parts and racks",
    title: "State-of-the-Art Facility",
    caption: "Modern warehouse and parts handling for quick turnarounds.",
  },
  {
    src: g5,
    alt: "Close-up of vehicle electrical system components",
    title: "Electrical Systems",
    caption: "Quality electrical systems tested for durability.",
  },
  {
    src: g6,
    alt: "Industrial components organized for assembly",
    title: "Quality Components",
    caption: "High-grade components that meet OEM standards.",
  },
];

const Gallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + galleryImages.length) % galleryImages.length
    );
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % galleryImages.length
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, showPrev, showNext]);

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
          {/* Hero */}
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="heading-primary mb-6">Our Gallery</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the quality and craftsmanship that has made Razzaq
                Automotives Vijayawada’s premier choice for heavy vehicle
                solutions since 1976.
              </p>
            </motion.div>
          </section>

          {/* Gallery Grid */}
          <section className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="group relative overflow-hidden rounded-lg bg-card border border-border/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openLightbox(index);
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {image.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{image.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Lightbox Modal */}
          {lightboxIndex !== null && (
            <div
              aria-modal="true"
              role="dialog"
              aria-label={`${galleryImages[lightboxIndex].title} — image viewer`}
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeLightbox}
              />

              <div className="relative max-w-6xl w-full mx-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="bg-background rounded-lg overflow-hidden shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={galleryImages[lightboxIndex].src}
                      alt={galleryImages[lightboxIndex].alt}
                      className="w-full h-[60vh] md:h-[80vh] object-contain bg-black"
                      loading="eager"
                    />

                    {/* Close */}
                    <button
                      onClick={closeLightbox}
                      aria-label="Close image viewer"
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-foreground rounded-md p-2"
                    >
                      ✕
                    </button>

                    {/* Prev / Next */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showPrev();
                      }}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
                    >
                      ‹
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showNext();
                      }}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
                    >
                      ›
                    </button>
                  </div>

                  {/* Caption + actions */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {galleryImages[lightboxIndex].title}
                      </h3>
                      {galleryImages[lightboxIndex].caption && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {galleryImages[lightboxIndex].caption}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={galleryImages[lightboxIndex].src}
                        download
                        className="btn-outline-hero px-4 py-2 text-sm rounded-md"
                        aria-label="Download image"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          // open in new tab
                          const w = window.open(galleryImages[lightboxIndex].src, "_blank");
                          if (w) w.opener = null;
                        }}
                        className="btn-glass px-4 py-2 text-sm rounded-md"
                        aria-label="Open image in new tab"
                      >
                        Open in new tab
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Gallery;
