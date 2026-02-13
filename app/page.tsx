import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hero } from '@/src/components/home/Hero'
import { SolutionsOverview } from '@/src/components/home/SolutionsOverview'
import { Process } from '@/src/components/home/Process'
import { Team } from '@/src/components/home/Team'
import { Reviews } from '@/src/components/home/Reviews'
import { Resources } from '@/src/components/home/Resources'
import { LocalAreas } from '@/src/components/home/LocalAreas'
import { HoustonNuances } from '@/src/components/home/HoustonNuances'
import { LocationMap } from '@/src/components/home/LocationMap'
import { FinalCta } from '@/src/components/home/FinalCta'
import type { Review } from '@/src/lib/proof'

export const runtime = 'edge'

/**
 * Homepage - Private Client Mortgage Advisory
 * 
 * Data-driven architecture with Google Reviews API integration
 */

async function getGoogleReviews(): Promise<Review[]> {
    try {
        // Use relative URL for API calls to work in all environments
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
        const response = await fetch(`${baseUrl}/api/google-reviews`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })

        if (!response.ok) {
            console.error('Failed to fetch Google reviews:', response.status)
            return []
        }

        const data = await response.json()

        // Transform API response to match Review interface
        return (data.reviews || []).map((review: any) => ({
            rating: review.rating || 5,
            author: review.authorName || 'Anonymous',
            text: review.text || '',
            date: review.relativeTime || review.time || 'Recent',
            profile_photo_url: review.authorPhoto || null
        }))
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return []
    }
}

export default async function Home() {
    const reviews = await getGoogleReviews()

    return (
        <>
            <Header />
            <main id="main-content">
                <Hero />
                <SolutionsOverview />
                <Process />
                <Team />
                <HoustonNuances />
                <Reviews reviews={reviews} />
                <LocalAreas />
                <Resources />
                <LocationMap />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
