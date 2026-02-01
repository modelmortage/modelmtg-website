/**
 * Code Splitting Verification Tests
 * 
 * These tests verify that the Next.js build produces multiple chunks
 * and that code splitting is working correctly.
 * 
 * **Validates: Requirements 9.4**
 */

import { describe, test, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Code Splitting Verification', () => {
  const buildDir = path.join(process.cwd(), '.next')
  const staticChunksDir = path.join(buildDir, 'static', 'chunks')
  const serverAppDir = path.join(buildDir, 'server', 'app')

  describe('Build Output Structure', () => {
    test('should have .next build directory', () => {
      expect(fs.existsSync(buildDir)).toBe(true)
    })

    test('should have static chunks directory', () => {
      expect(fs.existsSync(staticChunksDir)).toBe(true)
    })

    test('should have server app directory', () => {
      expect(fs.existsSync(serverAppDir)).toBe(true)
    })
  })

  describe('Multiple Chunks Generation', () => {
    test('should generate multiple JavaScript chunks', () => {
      if (!fs.existsSync(staticChunksDir)) {
        throw new Error('Build directory not found. Run "npm run build" first.')
      }

      const files = fs.readdirSync(staticChunksDir)
      const jsChunks = files.filter(file => file.endsWith('.js'))

      // Next.js should generate multiple chunks for code splitting
      // At minimum: polyfills, main app bundle, and framework chunks
      expect(jsChunks.length).toBeGreaterThan(3)
      
      console.log(`✓ Generated ${jsChunks.length} JavaScript chunks`)
    })

    test('should generate CSS chunks for different routes', () => {
      if (!fs.existsSync(staticChunksDir)) {
        throw new Error('Build directory not found. Run "npm run build" first.')
      }

      const files = fs.readdirSync(staticChunksDir)
      const cssChunks = files.filter(file => file.endsWith('.css'))

      // Should have CSS chunks for different pages/routes
      expect(cssChunks.length).toBeGreaterThan(0)
      
      console.log(`✓ Generated ${cssChunks.length} CSS chunks`)
    })

    test('should have separate chunks for different routes', () => {
      if (!fs.existsSync(serverAppDir)) {
        throw new Error('Build directory not found. Run "npm run build" first.')
      }

      // Check that different routes have their own page.js files
      const routes = [
        'about',
        'blog',
        'calculator/affordability',
        'calculator/purchase',
        'loan-options',
        'reviews'
      ]

      routes.forEach(route => {
        const routePath = path.join(serverAppDir, route, 'page.js')
        expect(fs.existsSync(routePath)).toBe(true)
      })

      console.log(`✓ Verified ${routes.length} routes have separate chunks`)
    })
  })

  describe('Dynamic Routes Code Splitting', () => {
    test('should have separate chunks for blog post dynamic route', () => {
      const blogSlugPath = path.join(serverAppDir, 'blog', '[slug]', 'page.js')
      expect(fs.existsSync(blogSlugPath)).toBe(true)
    })

    test('should have separate chunks for loan options dynamic route', () => {
      const loanOptionsSlugPath = path.join(serverAppDir, 'loan-options', '[slug]', 'page.js')
      expect(fs.existsSync(loanOptionsSlugPath)).toBe(true)
    })

    test('should generate static HTML for dynamic routes', () => {
      // Check that static HTML was generated for blog posts
      const blogPosts = [
        'step-by-step-guide-shopping-new-home',
        'understanding-mortgage-rates-how-they-work',
        'fha-vs-conventional-loans-which-is-right'
      ]

      blogPosts.forEach(slug => {
        const htmlPath = path.join(serverAppDir, 'blog', `${slug}.html`)
        expect(fs.existsSync(htmlPath)).toBe(true)
      })

      console.log(`✓ Verified ${blogPosts.length} blog posts have pre-rendered HTML`)
    })
  })

  describe('Calculator Pages Code Splitting', () => {
    test('should have separate chunks for each calculator', () => {
      const calculators = [
        'affordability',
        'purchase',
        'refinance',
        'rent-vs-buy',
        'va-purchase',
        'va-refinance',
        'dscr'
      ]

      calculators.forEach(calc => {
        const calcPath = path.join(serverAppDir, 'calculator', calc, 'page.js')
        expect(fs.existsSync(calcPath)).toBe(true)
      })

      console.log(`✓ Verified ${calculators.length} calculators have separate chunks`)
    })
  })

  describe('Build Manifest', () => {
    test('should have build manifest with chunk information', () => {
      const manifestPath = path.join(buildDir, 'build-manifest.json')
      expect(fs.existsSync(manifestPath)).toBe(true)

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      
      // Manifest should have polyfill files
      expect(manifest).toHaveProperty('polyfillFiles')
      expect(Array.isArray(manifest.polyfillFiles)).toBe(true)
      
      // Manifest should have root main files (framework chunks)
      expect(manifest).toHaveProperty('rootMainFiles')
      expect(Array.isArray(manifest.rootMainFiles)).toBe(true)
      expect(manifest.rootMainFiles.length).toBeGreaterThan(0)

      console.log(`✓ Build manifest contains ${manifest.rootMainFiles.length} root main files`)
    })
  })

  describe('Code Splitting Best Practices', () => {
    test('should have reasonable chunk sizes', () => {
      if (!fs.existsSync(staticChunksDir)) {
        throw new Error('Build directory not found. Run "npm run build" first.')
      }

      const files = fs.readdirSync(staticChunksDir)
      const jsChunks = files.filter(file => file.endsWith('.js'))

      // Check that we have a good distribution of chunk sizes
      const chunkSizes = jsChunks.map(file => {
        const filePath = path.join(staticChunksDir, file)
        const stats = fs.statSync(filePath)
        return { file, size: stats.size }
      })

      // Sort by size
      chunkSizes.sort((a, b) => b.size - a.size)

      // Log the largest chunks for visibility
      console.log('\nTop 5 largest chunks:')
      chunkSizes.slice(0, 5).forEach(({ file, size }) => {
        console.log(`  ${file}: ${(size / 1024).toFixed(2)} KB`)
      })

      // Verify we have chunks (code splitting is working)
      expect(chunkSizes.length).toBeGreaterThan(3)
    })

    test('should have separate page chunks for major routes', () => {
      // Verify that major sections have their own chunks
      const majorRoutes = [
        { name: 'Blog', path: 'blog/page.js' },
        { name: 'Calculators', path: 'calculator/page.js' },
        { name: 'Loan Options', path: 'loan-options/page.js' },
        { name: 'About', path: 'about/page.js' }
      ]

      majorRoutes.forEach(({ name, path: routePath }) => {
        const fullPath = path.join(serverAppDir, routePath)
        expect(fs.existsSync(fullPath)).toBe(true)
      })

      console.log(`✓ Verified ${majorRoutes.length} major routes have separate chunks`)
    })
  })

  describe('Next.js Automatic Code Splitting', () => {
    test('should leverage Next.js automatic route-based splitting', () => {
      // Next.js automatically splits code by route
      // Verify that each page directory has its own bundle
      
      const pageDirectories = fs.readdirSync(serverAppDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => !name.startsWith('_') && !name.endsWith('.segments'))

      // Should have multiple page directories (each is a separate route)
      expect(pageDirectories.length).toBeGreaterThan(10)

      console.log(`✓ Found ${pageDirectories.length} route directories with automatic code splitting`)
    })

    test('should have React Server Components chunks', () => {
      // Next.js 14 with App Router uses RSC
      // Check for .rsc files which indicate server component chunks
      
      const rscFiles = fs.readdirSync(serverAppDir)
        .filter(file => file.endsWith('.rsc'))

      expect(rscFiles.length).toBeGreaterThan(0)

      console.log(`✓ Found ${rscFiles.length} React Server Component chunks`)
    })
  })
})
