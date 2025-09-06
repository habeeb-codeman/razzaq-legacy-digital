import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  keywords?: string;
  author?: string;
  jsonLd?: object | object[] | null;
}

const siteUrl = "https://razzaqautomotives.com"; // REPLACE with your real domain
const defaultTitle = "Razzaq Automotives — Heavy Vehicle Parts & Service, Vijayawada";
const defaultDescription = "Razzaq Automotives — Trusted supplier of TATA, Ashok Leyland & Bharat Benz parts in Vijayawada since 1976. Premier heavy vehicle solutions for modern fleets.";
const defaultImage = `${siteUrl}/og-image.jpg`;
const defaultKeywords = "truck parts Vijayawada, Ashok Leyland parts Autonagar, TATA truck body parts Andhra Pradesh, heavy vehicle spares Vijayawada, truck cabin parts, fuel tank systems, automotive solutions";

function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: "Razzaq Automotives",
    image: defaultImage,
    "@id": `${siteUrl}/#organization`,
    url: siteUrl,
    telephone: "+918885673388",
    email: "razzaqautomotives.vij@gmail.com",
    priceRange: "₹₹",
    foundingDate: "1976",
    description: "Premier heavy vehicle parts supplier in Vijayawada since 1976. Specialized in TATA, Ashok Leyland, and Bharat Benz parts and services.",
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
    serviceArea: {
      "@type": "Place",
      name: "Vijayawada, Andhra Pradesh, India"
    },
    // REPLACE with your actual social/profile URLs
    sameAs: [
      "https://www.facebook.com/razzaqautomotives",
      "https://www.instagram.com/razzaqautomotives", 
      "https://www.linkedin.com/company/razzaqautomotives",
    ],
  };
}

/**
 * SEO component for React apps using react-helmet-async
 * Provides comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  keywords,
  author = 'Razzaq Automotives',
  jsonLd = null,
}) => {
  const finalTitle = title ? `${title} — Razzaq Automotives` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalCanonical = canonical || siteUrl;
  const finalKeywords = keywords || defaultKeywords;

  // Build JSON-LD array with LocalBusiness + optional page-specific schemas
  const defaultJsonLd = buildLocalBusinessJsonLd();
  let jsonLdArray: object[] = [defaultJsonLd];
  
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLdArray = [...jsonLdArray, ...jsonLd];
    } else {
      jsonLdArray.push(jsonLd);
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={finalCanonical} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="Razzaq Automotives" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Performance & Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
};

export default SEO;