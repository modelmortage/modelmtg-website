#!/usr/bin/env node

/**
 * Cloudflare Pages build script
 * This script runs the Next.js build with OpenNext Cloudflare adapter
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Cloudflare Pages...\n');

try {
  // Run OpenNext Cloudflare build
  console.log('📦 Running opennextjs-cloudflare build...');
  execSync('npx opennextjs-cloudflare build', { stdio: 'inherit' });

  // Clean up cache directory that exceeds Cloudflare's 25MB limit
  console.log('\n🧹 Cleaning up cache files...');
  
  const cacheDir = path.join(process.cwd(), '.open-next', 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log(`✓ Removed .open-next/cache/`);
  }

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Output directory: .open-next/worker');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
