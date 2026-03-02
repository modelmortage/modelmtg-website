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
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Check if it's a symlink
      if (entry.isSymbolicLink()) {
        const linkTarget = fs.readlinkSync(fullPath);
        if (linkTarget.includes('cache') || entry.name === 'cache') {
          fs.unlinkSync(fullPath);
          console.log(`✓ Removed symlink ${path.relative(process.cwd(), fullPath)}`);
        }
      } else if (entry.isDirectory()) {
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
  } catch (error) {
    console.warn(`Warning: Could not process ${dir}: ${error.message}`);
  }
}

console.log('🚀 Building for Cloudflare Pages...\n');

try {
  // Run OpenNext Cloudflare build
  console.log('📦 Running opennextjs-cloudflare build...');
  execSync('npx opennextjs-cloudflare build', { stdio: 'inherit' });

  // Clean up all cache directories and symlinks
  console.log('\n🧹 Cleaning up cache files...');
  findAndRemoveCacheDirs(path.join(process.cwd(), '.open-next'));

  // Double-check assets directory specifically
  const assetsCache = path.join(process.cwd(), '.open-next', 'assets', 'cache');
  if (fs.existsSync(assetsCache)) {
    const stats = fs.lstatSync(assetsCache);
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(assetsCache);
      console.log(`✓ Removed symlink .open-next/assets/cache`);
    } else if (stats.isDirectory()) {
      fs.rmSync(assetsCache, { recursive: true, force: true });
      console.log(`✓ Removed .open-next/assets/cache`);
    }
  }

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Output directory: .open-next/worker');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
