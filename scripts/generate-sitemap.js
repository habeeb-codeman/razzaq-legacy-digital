#!/usr/bin/env node

/**
 * Generate sitemap.xml for Razzaq Automotives website
 * Run with: node scripts/generate-sitemap.js
 * For automatic generation, add to package.json scripts: "postbuild": "node scripts/generate-sitemap.js"
 */

const fs = require('fs');
const path = require('path');

// REPLACE with your actual domain
const siteUrl = 'https://razzaqautomotives.com';

// Define your site routes and their priorities
const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  // Add more routes here as your site grows
  // {
  //   path: '/about',
  //   priority: '0.8',
  //   changefreq: 'monthly',
  //   lastmod: new Date().toISOString().split('T')[0]
  // },
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const distPath = path.join(process.cwd(), 'dist');
  const publicPath = path.join(process.cwd(), 'public');
  
  // Write to both dist (for production) and public (for development)
  if (fs.existsSync(distPath)) {
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), xml);
    console.log('✅ Sitemap generated: dist/sitemap.xml');
  }
  
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml);
  console.log('✅ Sitemap generated: public/sitemap.xml');
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };