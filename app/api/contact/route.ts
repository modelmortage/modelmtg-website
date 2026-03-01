import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

// ─── Zod schema ────────────────────────────────────────────────────────────
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
    // Honeypot — filled by bots, empty for humans
    company: z.preprocess(
        (val) => (val === null ? undefined : val),
        z.string().max(0).optional()
    ),
})

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    // 1. Origin check — block non-browser callers
    const origin = req.headers.get('origin') ?? ''
    const referer = req.headers.get('referer') ?? ''
    const isAllowedOrigin =
        origin.includes('modelmtg.com') ||
        origin.includes('localhost') ||
        referer.includes('modelmtg.com') ||
        referer.includes('localhost')

    if (!isAllowedOrigin) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
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

    // 3. Honeypot check — silently accept bots so they think they succeeded
    if (parsed.data.company) {
        return NextResponse.json({ ok: true })
    }

    // 4. Forward to Supabase Edge Function (server-side only, never exposed to browser)
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
