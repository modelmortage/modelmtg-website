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

export const runtime = 'edge'

/**
 * Homepage - Private Client Mortgage Advisory
 * 
 * Data-driven architecture with Google Reviews API integration
 */

export default function Home() {
    return (
        <>
            <Header />
            <main id="main-content">
                <Hero />
                <SolutionsOverview />
                <Process />
                <Team />
                <Reviews />
                <HoustonNuances />
                <LocalAreas />
                <Resources />
                <LocationMap />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
