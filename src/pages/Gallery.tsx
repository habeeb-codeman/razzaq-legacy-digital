"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryImage {
  filename: string;
  src: string;
  title: string;
  description?: string;
}

const prettifyName = (filename: string): string =>
  filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const MANIFEST_PATH = "/gallery.json";
    const API_ENDPOINT = "/api/gallery";

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
              title: prettifyName(it.filename),
              description: it.description || "",
            }));
          setImages(list);
          setError(null);
        } else {
          throw new Error("Invalid manifest format (expected array)");
        }
      })
      .catch(() => {
        // Fallback to API
        fetch(API_ENDPOINT)
          .then((res) => {
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (!mounted) return;
            if (Array.isArray(data.images)) {
              const list = data.images.map((item: any) => {
                const filename =
                  typeof item === "string"
                    ? item
                    : item.filename || item.name;
                return {
                  filename,
                  src: `/images/gallery/${filename}`,
                  title: prettifyName(filename),
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
        if (mounted) setLoading(false); // ✅ ensures loading stops for manifest success too
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading gallery...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!images.length) return <p>No images found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((img, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src={img.src}
            alt={img.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{img.title}</h3>
            {img.description && (
              <p className="text-gray-600 text-sm">{img.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
