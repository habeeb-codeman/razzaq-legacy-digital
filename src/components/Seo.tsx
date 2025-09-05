// components/Seo.tsx
import React from "react";

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noIndex?: boolean;
  jsonLd?: object | null; // optional page-specific JSON-LD to merge with default
};

const siteUrl = "https://yourdomain.com"; // <-- REPLACE with your real domain
const defaultTitle = "Razzaq Automotives — Heavy Vehicle Parts & Service, Vijayawada";
const defaultDescription =
  "Razzaq Automotives — Trusted supplier of TATA, Ashok Leyland & Bharat Benz parts in Vijayawada since 1976.";
const companyImage = `${siteUrl}/og-image.jpg`; // put your OG image at public/og-image.jpg
const organizationId = `${siteUrl}/#razzaq`;

function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: "Razzaq Automotives",
    image: companyImage,
    "@id": organizationId,
    url: siteUrl,
    telephone: "+918885673388",
    email: "razzaqautomotives.vij@gmail.com",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3rd Cross Road, Auto Nagar",
      addressLocality: "Vijayawada",
      addressRegion: "Andhra Pradesh",
      postalCode: "520007",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 16.5087592,
      longitude: 80.6480903,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "13:30",
      },
    ],
    // Replace with your actual social/profile URLs
    sameAs: [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourhandle",
      "https://www.linkedin.com/company/yourcompany",
    ],
  };
}

/**
 * SeoTags — server-safe component that renders meta tags + JSON-LD into <head>.
 *
 * Usage: include <SeoTags title="Page Title" description="..." /> INSIDE <head> in your app/layout.tsx
 */
const SeoTags: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  image,
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  jsonLd = null,
}) => {
  const finalTitle = title ? `${title} — Razzaq Automotives` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || companyImage;
  const finalCanonical = canonical || siteUrl;

  // default JSON-LD (LocalBusiness) and optional page-specific jsonLd merged as array
  const defaultJsonLd = buildLocalBusinessJsonLd();
  const ld = jsonLd ? [defaultJsonLd, jsonLd] : [defaultJsonLd];

  return (
    <>
      <meta charSet="utf-8" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="canonical" href={finalCanonical} />

      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalCanonical} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Preconnect / fonts / favicon */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="icon" href="/favicon.ico" />

      {/* JSON-LD structured data (LocalBusiness + optional page schemas) */}
      {ld.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default SeoTags;
