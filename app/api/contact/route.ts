import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ─── In-memory rate limiter ────────────────────────────────────────────────
// Simple per-IP window: max 5 submissions per 10 minutes
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const ipMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = ipMap.get(ip)
    if (!entry || now > entry.resetAt) {
        ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
        return false
    }
    if (entry.count >= MAX_REQUESTS) return true
    entry.count++
    return false
}

// ─── Zod schema ───────────────────────────────────────────────────────────
const ContactSchema = z.object({
    full_name: z.string().min(1).max(120),
    email: z.string().email().max(254),
    phone: z.preprocess(
        (val) => (val === null || val === '' ? undefined : val),
        z.string().max(20).optional()
    ),
    strategy_interest: z.enum([
        'purchase',
        'refinance',
        'investment',
        'construction',
        'consultation',
    ]),
    briefing_notes: z.preprocess(
        (val) => (val === null || val === '' ? undefined : val),
        z.string().max(250).optional()
    ),
    company: z.preprocess(
        (val) => (val === null ? undefined : val),
        z.string().max(0).optional()
    ),
})

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    // 1. Rate limiting
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        )
    }

    // 2. Parse & validate body
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid form data.', details: parsed.error.flatten() },
            { status: 422 }
        )
    }

    // 3. Honeypot check — bots fill this field, humans don't
    if (parsed.data.company) {
        // Silently accept so bots think they succeeded
        return NextResponse.json({ ok: true })
    }

    // 4. Forward to Supabase Edge Function (server-side only)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase env vars')
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    try {
        const upstream = await fetch(`${supabaseUrl}/functions/v1/contact-submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify(parsed.data),
        })

        const result = await upstream.json()

        if (!upstream.ok || !result.ok) {
            throw new Error(result.error || 'Upstream error')
        }

        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('Contact submit upstream error:', err)
        return NextResponse.json(
            { error: 'Failed to submit. Please try again.' },
            { status: 502 }
        )
    }
}
