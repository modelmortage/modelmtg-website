#!/usr/bin/env node

/**
 * Cloudflare Pages build script
 * This script runs the Next.js build with OpenNext Cloudflare adapter
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findAndRemoveCacheDirs(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name === 'cache') {
        // Remove cache directory
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed ${path.relative(process.cwd(), fullPath)}`);
      } else {
        // Recursively search subdirectories
        findAndRemoveCacheDirs(fullPath);
      }
    }
  }
}

console.log('� Building for Cloudflare Pages...\n');

try {
  // Run OpenNext Cloudflare build
  console.log('📦 Running opennextjs-cloudflare build...');
  execSync('npx opennextjs-cloudflare build', { stdio: 'inherit' });

  // Clean up all cache directories that exceed Cloudflare's 25MB limit
  console.log('\n🧹 Cleaning up cache files...');
  findAndRemoveCacheDirs(path.join(process.cwd(), '.open-next'));

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Output directory: .open-next/worker');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
