import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import TrustBar from '@/components/home/TrustBar'
import MarketPowerSection from '@/components/home/MarketPowerSection'
import AuthorityTimeline from '@/components/home/AuthorityTimeline'
import LoanProgramsGrid from '@/components/home/LoanProgramsGrid'
import PersonalBrandSection from '@/components/home/PersonalBrandSection'
import TrustStackWall from '@/components/home/TrustStackWall'

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <TrustBar />
                <LoanProgramsGrid />
                <MarketPowerSection />
                <AuthorityTimeline />
                <TrustStackWall />
                <PersonalBrandSection />
            </main>
            <Footer />

            {/* Sticky CTA */}
            <a
                href="/pre-qualify"
                className="sticky-cta btn btn-primary"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 1000,
                    textDecoration: 'none'
                }}
            >
                Get Pre-Approved
            </a>

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
                        "priceRange": "$$",
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
