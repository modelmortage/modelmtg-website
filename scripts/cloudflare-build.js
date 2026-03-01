#!/usr/bin/env node

/**
 * Cloudflare Pages build script
 * This script runs the Next.js build with Cloudflare adapter
 */

const { execSync } = require('child_process');

console.log('🚀 Building for Cloudflare Pages...\n');

try {
  // Run Next.js build with Cloudflare adapter
  console.log('📦 Running @cloudflare/next-on-pages build...');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Output directory: .vercel/output/static');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
