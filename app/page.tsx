import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hero } from '@/src/components/home/Hero'
import { SolutionsOverview } from '@/src/components/home/SolutionsOverview'
import { Process } from '@/src/components/home/Process'

import { Reviews } from '@/src/components/home/Reviews'

import { LocalAreas } from '@/src/components/home/LocalAreas'
import { MortgageInsights } from '@/src/components/home/MortgageInsights'
import { LocationMap } from '@/src/components/home/LocationMap'
import { FinalCta } from '@/src/components/home/FinalCta'

export const metadata: Metadata = {
    title: 'Model Mortgage | Trusted Mortgage Lending Solutions',
    description: 'Expert mortgage lender providing personalized home loan solutions including FHA, VA, conventional, jumbo loans, and refinancing. Matthew Bramow provides expert guidance. Call (832) 727-4128.',
    keywords: 'mortgage lender, home loans, mortgage rates, FHA loans, VA loans, refinancing, jumbo loans, Matthew Bramow, Model Mortgage, Texas mortgage',
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

                <MortgageInsights />
                <LocalAreas />
                <LocationMap />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
