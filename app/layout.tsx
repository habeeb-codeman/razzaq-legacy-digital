// app/layout.tsx
import "./globals.css";
import React from "react";
import SeoTags from "@/components/Seo";
import type { ReactNode } from "react";

/**
 * Root layout for Next.js App Router.
 * - Renders SeoTags inside <head> (site-level defaults).
 * - Preloads fonts and sets top-level html/body attributes.
 *
 * Customize:
 *  - Replace site title/description in components/Seo.tsx if desired.
 *  - Add google-site-verification meta here if you have a token (comment placeholder added).
 */

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Site-wide SEO tags + LocalBusiness JSON-LD */}
        <SeoTags />

        {/* Example: add Google site verification meta tag here after you get the token */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" /> */}

        {/* Preload fonts example - adjust if you host fonts locally */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* If using Google Fonts, this loads Inter and Space Grotesk similar to your current CSS */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Optional: a small noscript notice for visitors without JS */}
        <noscript>
          <div style={{ padding: 12, textAlign: "center", background: "#111827", color: "#f3f4f6" }}>
            This site works best with JavaScript enabled.
          </div>
        </noscript>
      </body>
    </html>
  );
}
