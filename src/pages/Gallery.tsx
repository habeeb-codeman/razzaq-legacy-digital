// // src/pages/Gallery.tsx
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";

// /**
//  * Resilient Gallery page:
//  * - Tries to load public/images/gallery/gallery.json first (static manifest)
//  * - Falls back to /api/gallery if manifest not found
//  * - Shows filename (no extension) as top overlay on hover and description (from manifest/API) in bottom overlay
//  *
//  * To guarantee successful deploys on Vercel: add a static manifest at:
//  * public/images/gallery/gallery.json
//  */

// type GalleryImage = {
//   filename: string;
//   src: string;
//   title: string; // prettified filename (without extension)
//   description?: string;
// };

// const MANIFEST_PATH = "/images/gallery/gallery.json";
// const API_ENDPOINT = "/api/gallery";

// function prettifyName(filename: string) {
//   const base = filename.replace(/\.[^/.]+$/, "");
//   return base
//     .replace(/[_-]+/g, " ")
//     .replace(/\b\w/g, (ch) => ch.toUpperCase());
// }

// export default function GalleryPage(): JSX.Element {
//   const [images, setImages] = useState<GalleryImage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);

//     // Try static manifest first
//     fetch(MANIFEST_PATH)
//       .then((res) => {
//         if (!res.ok) throw new Error("Manifest not found");
//         return res.json();
//       })
//       .then((data) => {
//         if (!mounted) return;

//         if (Array.isArray(data)) {
//           const list: GalleryImage[] = data
//             .filter((it: any) => it && it.filename)
//             .map((it: any) => ({
//               filename: it.filename,
//               src: `/images/gallery/${it.filename}`,
//               title: prettifyName(it.filename),
//               description: it.description || "",
//             }));
//           setImages(list);
//           setError(null);
//         } else {
//           throw new Error("Invalid manifest format (expected array)");
//         }
//       })
//       .catch(() => {
//         // manifest failed — fallback to API
//         fetch(API_ENDPOINT)
//           .then((res) => {
//             if (!res.ok) throw new Error(`API returned ${res.status}`);
//             return res.json();
//           })
//           .then((data) => {
//             if (!mounted) return;

//             if (Array.isArray(data.images)) {
//               const list: GalleryImage[] = data.images.map((item: any) => {
//                 if (typeof item === "string") {
//                   return {
//                     filename: item,
//                     src: `/images/gallery/${item}`,
//                     title: prettifyName(item),
//                     description: "",
//                   };
//                 } else {
//                   const filename = item.filename || item.name;
//                   return {
//                     filename,
//                     src: `/images/gallery/${filename}`,
//                     title: prettifyName(filename),
//                     description: item.description || "",
//                   };
//                 }
//               });
//               setImages(list);
//               setError(null);
//             } else {
//               throw new Error("API returned unexpected structure");
//             }
//           })
//           .catch((err) => {
//             console.error("Gallery load error:", err);
//             if (mounted) setError(String(err?.message || err));
//             setImages([]);
//           })
//           .finally(() => {
//             if (mounted) setLoading(false);
//           });
//       })
//       .finally(() => {
//         if (mounted) setLoading(false);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const openLightbox = (index: number) => setLightboxIndex(index);
//   const closeLightbox = () => setLightboxIndex(null);

//   const showPrev = useCallback(() => {
//     setLightboxIndex((prev) =>
//       prev === null ? 0 : (prev - 1 + images.length) % images.length
//     );
//   }, [images.length]);

//   const showNext = useCallback(() => {
//     setLightboxIndex((prev) =>
//       prev === null ? 0 : (prev + 1) % images.length
//     );
//   }, [images.length]);

//   useEffect(() => {
//     if (lightboxIndex === null) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") closeLightbox();
//       if (e.key === "ArrowLeft") showPrev();
//       if (e.key === "ArrowRight") showNext();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [lightboxIndex, showPrev, showNext]);

//   return (
//     <>
//       <div className="min-h-screen bg-background">
//         <Navigation />

//         <main className="pt-24 pb-16">
//           <section className="container mx-auto px-6 py-16">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <h1 className="heading-primary mb-6">Our Gallery</h1>
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 Hover an image to see its title. Click to open viewer.
//               </p>
//             </motion.div>
//           </section>

//           <section className="container mx-auto px-6">
//             {loading ? (
//               <div className="text-center py-20 text-muted-foreground">
//                 Loading gallery…
//               </div>
//             ) : error ? (
//               <div className="text-center py-20 text-destructive">
//                 Error: {error}
//               </div>
//             ) : images.length === 0 ? (
//               <div className="text-center py-20 text-muted-foreground">
//                 No gallery images found.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {images.map((img, i) => (
//                   <motion.div
//                     key={img.filename}
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     viewport={{ once: true, amount: 0.2 }}
//                     transition={{ duration: 0.45, delay: i * 0.04 }}
//                     className="group relative overflow-hidden rounded-lg bg-card border border-border/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
//                     onClick={() => openLightbox(i)}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") openLightbox(i);
//                     }}
//                   >
//                     <div className="aspect-[4/3] overflow-hidden">
//                       <img
//                         src={img.src}
//                         alt={img.title}
//                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                         loading="lazy"
//                       />
//                     </div>

//                     {/* Top overlay: filename/title on hover */}
//                     <div className="absolute left-0 right-0 top-0 p-3 pointer-events-none">
//                       <div className="bg-gradient-to-b from-black/60 to-transparent rounded-b-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
//                         <p className="text-xs text-white/95 font-medium truncate">
//                           {img.title}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Bottom overlay: description */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                       <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
//                         <h3 className="text-lg font-semibold text-foreground mb-1">
//                           {img.title}
//                         </h3>
//                         <p className="text-sm text-muted-foreground">
//                           {img.description && img.description.length > 0
//                             ? img.description
//                             : img.title}
//                         </p>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* Lightbox */}
//           {lightboxIndex !== null && images[lightboxIndex] && (
//             <div
//               aria-modal="true"
//               role="dialog"
//               aria-label={`${images[lightboxIndex].title} — image viewer`}
//               className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
//             >
//               <div
//                 className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//                 onClick={closeLightbox}
//               />
//               <div className="relative max-w-6xl w-full mx-auto">
//                 <motion.div
//                   initial={{ scale: 0.95, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.25 }}
//                   className="bg-background rounded-lg overflow-hidden shadow-2xl"
//                 >
//                   <div className="relative">
//                     <img
//                       src={images[lightboxIndex].src}
//                       alt={images[lightboxIndex].title}
//                       className="w-full h-[60vh] md:h-[80vh] object-contain bg-black"
//                       loading="eager"
//                     />
//                     <button
//                       onClick={closeLightbox}
//                       aria-label="Close image viewer"
//                       className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-foreground rounded-md p-2"
//                     >
//                       ✕
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setLightboxIndex((p) =>
//                           p === null
//                             ? 0
//                             : (p - 1 + images.length) % images.length
//                         );
//                       }}
//                       aria-label="Previous image"
//                       className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
//                     >
//                       ‹
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setLightboxIndex((p) =>
//                           p === null ? 0 : (p + 1) % images.length
//                         );
//                       }}
//                       aria-label="Next image"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
//                     >
//                       ›
//                     </button>
//                   </div>
//                   <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <div>
//                       <h3 className="text-lg font-semibold">
//                         {images[lightboxIndex].title}
//                       </h3>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {images[lightboxIndex].description &&
//                         images[lightboxIndex].description.length > 0
//                           ? images[lightboxIndex].description
//                           : images[lightboxIndex].title}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <a
//                         href={images[lightboxIndex].src}
//                         download
//                         className="btn-outline-hero px-4 py-2 text-sm rounded-md"
//                         aria-label="Download image"
//                       >
//                         Download
//                       </a>
//                       <button
//                         onClick={() => {
//                           const w = window.open(
//                             images[lightboxIndex].src,
//                             "_blank"
//                           );
//                           if (w) w.opener = null;
//                         }}
//                         className="btn-glass px-4 py-2 text-sm rounded-md"
//                         aria-label="Open image in new tab"
//                       >
//                         Open in new tab
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           )}
//         </main>

//         <Footer />
//       </div>
//     </>
//   );
// }













// src/pages/Gallery.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

/**
 * Products page:
 * - This version fetches product data from a static manifest file.
 * - Displays the product_name as the title and the description from the data.
 *
 * To guarantee successful deploys on Vercel: add a static manifest at:
 * public/images/gallery/gallery.json
 */

type GalleryImage = {
  filename: string;
  src: string;
  product_name: string;
  description?: string;
};

const MANIFEST_PATH = "/images/gallery/gallery.json";
const API_ENDPOINT = "/api/gallery";

export default function GalleryPage(): JSX.Element {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Try static manifest first
    fetch(MANIFEST_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("Manifest not found");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          const list: GalleryImage[] = data
            .filter((it: any) => it && it.filename)
            .map((it: any) => ({
              filename: it.filename,
              src: `/images/gallery/${it.filename}`,
              product_name: it.product_name || it.filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
              description: it.description || "",
            }));
          setImages(list);
          setError(null);
        } else {
          throw new Error("Invalid manifest format (expected array)");
        }
      })
      .catch(() => {
        // manifest failed — fallback to API
        fetch(API_ENDPOINT)
          .then((res) => {
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (!mounted) return;

            if (Array.isArray(data.images)) {
              const list: GalleryImage[] = data.images.map((item: any) => {
                const filename = item.filename || item.name;
                return {
                  filename,
                  src: `/images/gallery/${filename}`,
                  product_name: item.product_name || filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
                  description: item.description || "",
                };
              });
              setImages(list);
              setError(null);
            } else {
              throw new Error("API returned unexpected structure");
            }
          })
          .catch((err) => {
            console.error("Gallery load error:", err);
            if (mounted) setError(String(err?.message || err));
            setImages([]);
          })
          .finally(() => {
            if (mounted) setLoading(false);
          });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % images.length
    );
  }, [images.length]);

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
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="heading-primary mb-6">Our Products</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our range of high-quality automotive parts.
              </p>
            </motion.div>
          </section>

          <section className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">
                Loading products…
              </div>
            ) : error ? (
              <div className="text-center py-20 text-destructive">
                Error: {error}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((img, i) => (
                  <motion.div
                    key={img.filename}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-card"
                    onClick={() => openLightbox(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openLightbox(i);
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 bg-card-foreground text-foreground">
                      <h3 className="text-xl font-semibold mb-1 truncate">
                        {img.product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {img.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Lightbox */}
          {lightboxIndex !== null && images[lightboxIndex] && (
            <div
              aria-modal="true"
              role="dialog"
              aria-label={`${images[lightboxIndex].product_name} — image viewer`}
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <div
                className="absolute inset-0"
                onClick={closeLightbox}
              />
              <div className="relative max-w-6xl w-full mx-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-lg overflow-hidden shadow-2xl"
                >
                  <div className="relative">
                    <img
                      src={images[lightboxIndex].src}
                      alt={images[lightboxIndex].product_name}
                      className="w-full h-[60vh] md:h-[80vh] object-contain"
                      loading="eager"
                    />
                    <button
                      onClick={closeLightbox}
                      aria-label="Close image viewer"
                      className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((p) =>
                          p === null
                            ? 0
                            : (p - 1 + images.length) % images.length
                        );
                      }}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((p) =>
                          p === null ? 0 : (p + 1) % images.length
                        );
                      }}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {images[lightboxIndex].product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {images[lightboxIndex].description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={images[lightboxIndex].src}
                        download
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        aria-label="Download image"
                      >
                        Download
                      </a>
                      <a
                        href={`https://wa.me/918885673388?text=Hello, I would like to enquire about the product: ${images[lightboxIndex].product_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
                        aria-label="Send an enquiry via WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.11c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.5 3.42 1.46 4.88L2.11 22.9l6.01-1.58c1.4-.48 2.87-.72 4.36-.72 5.46 0 9.91-4.45 9.91-9.91S17.5 2.11 12.04 2.11zm4.61 14.28c-.28.7-1.74 1.41-2.45 1.41-.71 0-1.42-.3-2.07-.88-.71-.62-1.63-1.84-2.34-2.55s-1.12-1.7-.84-2.41c.28-.7.83-1.07 1.12-1.39.29-.3.65-.4.88-.23.23.17.65.2.98.6.34.4.65.8.98 1.13.3.3.61.34.88.17.29-.17.71-.23 1.12-.27.4-.04.91-.16 1.32-.47.4-.3.6-.66.83-1.07s.48-1.07.61-1.42c.13-.35.16-.62.06-.86s-.31-.56-.6-.71c-.29-.14-.62-.23-.88-.27-.26-.04-.57-.04-.88-.04-.32 0-.61.03-.83.06-.29.06-.6.18-.88.47s-.5.66-.6 1.07c-.1.4-.17.84-.04 1.25s.5.91 1.07 1.63c.57.71 1.25 1.58 1.84 2.19.57.6 1.07.8 1.42.8.35 0 .68-.07.95-.14.26-.07.6-.26.83-.54.23-.29.35-.6.44-.71.07-.1.15-.22.25-.32s.22-.2.32-.23.2-.08.3-.08c.1 0 .21.01.32.04l.32.12c.1.03.2.06.32.1.1.04.22.08.32.14.1.06.2.16.29.28.09.13.17.25.25.4.1.13.2.29.3.5.1.21.18.44.25.68.07.24.13.5.18.78.04.28.04.57.04.86.0 1.25-.91 1.96-1.78 2.24z"/></svg>
                        Send Enquiry
                      </a>
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
}
