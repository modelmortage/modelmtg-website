#!/usr/bin/env node
/**
 * patch-next-on-pages.js
 *
 * Problem: @cloudflare/next-on-pages@1.13.4 invokes esbuild with:
 *   external: ["node:*", ...]
 * This marks "node:async_hooks" as external but NOT plain "async_hooks".
 * Next.js 15's @next/request-context uses require("async_hooks") without
 * the node: prefix, so esbuild tries to resolve it from the filesystem and
 * fails with "Could not resolve async_hooks".
 *
 * Fix: add "async_hooks" to the external list so esbuild leaves it as a
 * require() call in the output. At runtime, Cloudflare Workers provides
 * async_hooks via the nodejs_compat compatibility flag (set in wrangler.toml).
 *
 * This script is run via the "postinstall" npm hook so it re-applies the
 * patch every time the Cloudflare Pages build environment runs npm install.
 */

const fs = require('fs')
const path = require('path')

const DIST = path.join(
    __dirname,
    '..',
    'node_modules',
    '@cloudflare',
    'next-on-pages',
    'dist',
    'index.js'
)

if (!fs.existsSync(DIST)) {
    console.log('⚠️  @cloudflare/next-on-pages dist not found, skipping patch')
    process.exit(0)
}

let code = fs.readFileSync(DIST, 'utf8')

const BEFORE = 'external: ["node:*", `${relativeNopDistPath}/*`, "*.wasm", "cloudflare:*"]'
const AFTER = 'external: ["node:*", "async_hooks", `${relativeNopDistPath}/*`, "*.wasm", "cloudflare:*"]'

if (code.includes(AFTER)) {
    console.log('✓ @cloudflare/next-on-pages already patched – nothing to do')
    process.exit(0)
}

if (!code.includes(BEFORE)) {
    // The dist format changed – don't fail the build, just warn
    console.warn('⚠️  Could not find esbuild external config in next-on-pages dist (format may have changed)')
    process.exit(0)
}

code = code.replace(BEFORE, AFTER)
fs.writeFileSync(DIST, code)
console.log('✅ Patched @cloudflare/next-on-pages: async_hooks marked as esbuild external')
