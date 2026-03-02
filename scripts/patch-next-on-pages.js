#!/usr/bin/env node
/**
 * patch-next-on-pages.js
 *
 * Problem: @cloudflare/next-on-pages invokes esbuild with:
 *   external: ["node:*", ...]
 * This marks "node:async_hooks" as external but NOT plain "async_hooks",
 * and also fails to resolve "cookie" and internal dynamic imports
 * under esbuild's "neutral" platform.
 *
 * Fix: add "async_hooks", "cookie", and internal next-on-pages assets
 * to the external list so esbuild leaves them as a require()/import
 * call in the output. At runtime, Cloudflare Workers provides
 * async_hooks via the nodejs_compat compatibility flag.
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

if (code.includes('"async_hooks"') && code.includes('"cookie"')) {
    console.log('✓ @cloudflare/next-on-pages already patched – nothing to do')
    process.exit(0)
}

const regex = /external:\s*\[\s*"node:\*"\s*,/g;

if (regex.test(code)) {
    code = code.replace(regex, 'external: ["node:*", "async_hooks", "cookie", "./__next-on-pages-dist__/assets/*", "./__next-on-pages-dist__/cache/*",');
    fs.writeFileSync(DIST, code)
    console.log('✅ Patched @cloudflare/next-on-pages: async_hooks, cookie, etc. marked as esbuild external')
} else {
    console.warn('⚠️  Could not find esbuild external config in next-on-pages dist')
}
