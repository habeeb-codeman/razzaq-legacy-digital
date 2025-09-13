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
const API_ENDPOINT = "/api/product";

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
                Hover on a product to see its name. Click to open a larger view with details.
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="group relative overflow-hidden rounded-lg bg-card border border-border/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
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

                    {/* Top overlay: product name on hover */}
                    <div className="absolute left-0 right-0 top-0 p-3 pointer-events-none">
                      <div className="bg-gradient-to-b from-black/60 to-transparent rounded-b-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                        <p className="text-xs text-white/95 font-medium truncate">
                          {img.product_name}
                        </p>
                      </div>
                    </div>

                    {/* Bottom overlay: description */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {img.product_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {img.description}
                        </p>
                      </div>
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
                  <div className="relative">
                    <img
                      src={images[lightboxIndex].src}
                      alt={images[lightboxIndex].product_name}
                      className="w-full h-[60vh] md:h-[80vh] object-contain bg-black"
                      loading="eager"
                    />
                    <button
                      onClick={closeLightbox}
                      aria-label="Close image viewer"
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-foreground rounded-md p-2"
                    >
                      ✕
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((p) =>
                          p === null ? 0 : (p + 1) % images.length
                        );
                      }}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 rounded-full p-2"
                    >
                      ›
                    </button>
                  </div>
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
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
                        className="btn-outline-hero px-4 py-2 text-sm rounded-md"
                        aria-label="Download image"
                      >
                        Download
                      </a>
                      <a
                        href={`https://wa.me/918885673388?text=Hello, I would like to enquire about the product: ${images[lightboxIndex].product_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass px-4 py-2 text-sm rounded-md"
                        aria-label="Send an enquiry via WhatsApp"
                      >
                        Send Enquiry
                      </a>
{/*                       <button
                        onClick={() => {
                          const w = window.open(
                            images[lightboxIndex].src,
                            "_blank"
                          );
                          if (w) w.opener = null;
                        }}
                        className="btn-glass px-4 py-2 text-sm rounded-md"
                        aria-label="Open image in new tab"
                      >
                        Open in new tab
                      </button> */}
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
