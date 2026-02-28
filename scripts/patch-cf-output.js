#!/usr/bin/env node
/**
 * patch-cf-output.js
 *
 * @cloudflare/next-on-pages@1.13.4 cannot parse the Next.js 15 prerender config
 * format for SSG routes with generateStaticParams. It emits "Invalid prerender config"
 * warnings and then tries to bundle those routes as edge functions, pulling in
 * @next/request-context which requires Node.js-only `async_hooks`.
 *
 * Fix: delete the function directories and prerender configs for those routes BEFORE
 * @cloudflare/next-on-pages processes the .vercel/output. They are already pre-rendered
 * as static HTML in .vercel/output/static/, so no edge function is needed.
 *
 * Usage: run after `npx vercel build`, before `npx @cloudflare/next-on-pages --skip-build`
 */

const fs = require('fs')
const path = require('path')

const FUNCTIONS_DIR = path.join(process.cwd(), '.vercel', 'output', 'functions')

// Fully-static SSG routes that trigger "Invalid prerender config" in next-on-pages.
// Each must have `generateStaticParams` + `dynamicParams = false` defined.
const STATIC_ONLY_ROUTES = [
    path.join('blog', '[slug]'),
    path.join('loan-options', '[slug]'),
]

function removeIfExists(target) {
    if (!fs.existsSync(target)) return
    const stat = fs.statSync(target)
    if (stat.isDirectory()) {
        fs.rmSync(target, { recursive: true, force: true })
    } else {
        fs.unlinkSync(target)
    }
    console.log(`  ✓ removed ${path.relative(process.cwd(), target)}`)
}

console.log('\n🔧 Patching .vercel/output for Cloudflare Pages...\n')

for (const route of STATIC_ONLY_ROUTES) {
    const display = '/' + route.replace(/\\/g, '/')
    console.log(`  route: ${display}`)

    // main function dir + prerender config
    removeIfExists(path.join(FUNCTIONS_DIR, route + '.func'))
    removeIfExists(path.join(FUNCTIONS_DIR, route + '.prerender-config.json'))

    // RSC variant
    removeIfExists(path.join(FUNCTIONS_DIR, route + '.rsc.func'))
    removeIfExists(path.join(FUNCTIONS_DIR, route + '.rsc.prerender-config.json'))
}

console.log('\n✅ Patch complete.\n')
