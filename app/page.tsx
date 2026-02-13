import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hero } from '@/src/components/home/Hero'
import { Pillars } from '@/src/components/home/Pillars'
import { Programs } from '@/src/components/home/Programs'
import { Rates } from '@/src/components/home/Rates'
import { Process } from '@/src/components/home/Process'
import { Team } from '@/src/components/home/Team'
import { Reviews } from '@/src/components/home/Reviews'
import { Transactions } from '@/src/components/home/Transactions'
import { Resources } from '@/src/components/home/Resources'
import { LocalAreas } from '@/src/components/home/LocalAreas'
import { FinalCta } from '@/src/components/home/FinalCta'
import type { Review } from '@/src/lib/proof'

/**
 * Homepage - Private Client Mortgage Advisory
 * 
 * Data-driven architecture with Google Reviews API integration
 */

async function getGoogleReviews(): Promise<Review[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-reviews`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })

        if (!response.ok) {
            console.error('Failed to fetch Google reviews')
            return []
        }

        const data = await response.json()

        // Transform API response to match Review interface
        return (data.reviews || []).map((review: any) => ({
            rating: review.rating || 5,
            author: review.authorName || 'Anonymous',
            text: review.text || '',
            date: review.relativeTime || review.time || 'Recent'
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
                <Pillars />
                <Programs />
                <Rates />
                <Process />
                <Team />
                <Reviews reviews={reviews} />
                <Transactions />
                <Resources />
                <LocalAreas />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
