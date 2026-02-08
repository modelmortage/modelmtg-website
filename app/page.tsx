import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import PerformanceMetrics from '@/components/home/PerformanceMetrics'
import ClientProfiles from '@/components/home/ClientProfiles'
import AdvantageSection from '@/components/home/AdvantageSection'
import HowWeWinSection from '@/components/home/HowWeWinSection'
import MarketPowerSection from '@/components/home/MarketPowerSection'
import TeamPreviewSection from '@/components/home/TeamPreviewSection'
import TrustStackWall from '@/components/home/TrustStackWall'
import CinematicCTA from '@/components/home/CinematicCTA'
import Link from 'next/link'
import { Button } from '@/components/design-system'

import { Metadata } from 'next'

export const metadata: Metadata = {
    alternates: {
        canonical: '/',
    },
}

export default function Home() {
    return (
        <>
            <Header />
            <main id="main-content">
                <HeroSection />
                <PerformanceMetrics />
                <ClientProfiles />
                <AdvantageSection />
                <HowWeWinSection />
                <MarketPowerSection />
                <TeamPreviewSection />
                <TrustStackWall />
                <CinematicCTA />
            </main>
            <Footer />

            {/* Sticky CTA */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 1000,
                }}
                className="sticky-cta-container"
            >
                <Link href="/contact" passHref legacyBehavior>
                    <a className="btn-glass-pill" style={{ textDecoration: 'none' }}>
                        <span style={{ width: '8px', height: '8px', background: '#1FB6A6', borderRadius: '50%', display: 'inline-block' }}></span>
                        Schedule Call
                    </a>
                </Link>
            </div>

            {/* Structured Data - Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Model Mortgage",
                        "url": "https://modelmtg.com",
                        "logo": "https://modelmtg.com/logo.png",
                        "description": "Strategic mortgage planning for buyers who refuse to lose. Expert mortgage broker in Houston, TX.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Houston",
                            "addressRegion": "TX",
                            "postalCode": "77002",
                            "addressCountry": "US"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "(832) 727-4128",
                            "contactType": "customer service",
                            "areaServed": "US",
                            "availableLanguage": "English"
                        },
                        "sameAs": [
                            "https://www.facebook.com/modelmortgage",
                            "https://www.linkedin.com/company/model-mortgage"
                        ]
                    })
                }}
            />

            {/* Structured Data - LocalBusiness Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "RealEstateAgent",
                        "name": "Model Mortgage - Matthew Bramow",
                        "image": "/logo.png",
                        "description": "Strategic mortgage planning for buyers who refuse to lose. Expert mortgage broker in Houston, TX.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Houston",
                            "addressRegion": "TX",
                            "addressCountry": "US"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 29.7604,
                            "longitude": -95.3698
                        },
                        "telephone": "(832) 727-4128",
                        "priceRange": "$",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "5.0",
                            "reviewCount": "1000"
                        }
                    })
                }}
            />
        </>
    )
}
