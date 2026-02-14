import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Simple in-memory cache
let reviewsCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
    try {
        // Check environment variables
        const apiKey = process.env.GOOGLE_PLACES_API_KEY
        const placeId = process.env.GOOGLE_PLACE_ID

        if (!apiKey || !placeId) {
            return NextResponse.json(
                { error: 'Missing API configuration' },
                { status: 500 }
            )
        }

        // Check cache
        const now = Date.now()
        if (reviewsCache && now - reviewsCache.timestamp < CACHE_DURATION) {
            return NextResponse.json(reviewsCache.data)
        }

        // Fetch from Google Places API (New)
        const fields = 'reviews,rating,userRatingCount'
        const url = `https://places.googleapis.com/v1/places/${placeId}`

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': fields,
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Google Places API error:', errorText)
            return NextResponse.json(
                { error: 'Failed to fetch reviews from Google', details: errorText },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Transform the data to a cleaner format
        const transformedData = {
            rating: data.rating || 5.0,
            reviewCount: data.userRatingCount || 0,
            reviews: (data.reviews || []).map((review: any) => ({
                authorName: review.authorAttribution?.displayName || 'Anonymous',
                authorPhoto: review.authorAttribution?.photoUri || null,
                rating: review.rating || 5,
                text: review.text?.text || review.originalText?.text || '',
                relativeTime: review.relativePublishTimeDescription || '',
                time: review.publishTime || '',
            })),
        }

        // Update cache
        reviewsCache = {
            data: transformedData,
            timestamp: now,
        }

        return NextResponse.json(transformedData)
    } catch (error) {
        console.error('Error fetching Google reviews:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
