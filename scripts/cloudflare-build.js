#!/usr/bin/env node

/**
 * Cloudflare Pages build script
 * This script runs the Next.js build and prepares it for Cloudflare Pages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Cloudflare Pages...\n');

try {
  // Run Next.js build
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
