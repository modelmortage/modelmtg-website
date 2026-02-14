import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hero } from '@/src/components/home/Hero'
import { SolutionsOverview } from '@/src/components/home/SolutionsOverview'
import { Process } from '@/src/components/home/Process'

import { Reviews } from '@/src/components/home/Reviews'
import { ElfsightWidget } from '@/src/components/home/ElfsightWidget'
import { Resources } from '@/src/components/home/Resources'
import { LocalAreas } from '@/src/components/home/LocalAreas'
import { HoustonNuances } from '@/src/components/home/HoustonNuances'
import { LocationMap } from '@/src/components/home/LocationMap'
import { FinalCta } from '@/src/components/home/FinalCta'

export const runtime = 'edge'

export const metadata: Metadata = {
    title: 'Model Mortgage | Houston Mortgage Broker | Home Loans & Refinancing',
    description: 'Expert mortgage broker in Houston, TX. Get personalized home loan solutions including FHA, VA, conventional, jumbo loans, and refinancing. Matthew Bramow provides expert guidance. Call (832) 727-4128.',
    keywords: 'Houston mortgage broker, home loans Houston, mortgage rates Texas, FHA loans, VA loans, refinancing Houston, jumbo loans, Matthew Bramow, Model Mortgage, Spring TX',
    alternates: {
        canonical: 'https://modelmtg.com',
    },
}

/**
 * Homepage - Model Mortgage
 * 
 * Professional mortgage brokerage serving Houston and surrounding areas
 */

export default function Home() {
    return (
        <>
            <Header />
            <main id="main-content">
                <Hero />
                <SolutionsOverview />
                <Process />

                <Reviews />
                <ElfsightWidget />
                <HoustonNuances />
                <LocalAreas />
                <LocationMap />
                <Resources />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
