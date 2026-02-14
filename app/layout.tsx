import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import ScrollToTop from '@/components/ScrollToTop'
import './globals.css'

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-serif',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Model Mortgage | Houston Mortgage Broker | Expert Home Loan Solutions',
    description: 'Houston-based mortgage broker specializing in home loans, refinancing, FHA, VA, conventional, and jumbo mortgages. Expert guidance from Matthew Bramow. Licensed in Texas. Call (832) 727-4128.',
    keywords: 'Houston mortgage broker, Texas home loans, mortgage lender Houston, FHA loans, VA loans, conventional loans, jumbo mortgages, refinancing, Matthew Bramow, Model Mortgage, Spring TX mortgage broker',
    authors: [{ name: 'Matthew Bramow' }],
    metadataBase: new URL('https://modelmtg.com'),
    icons: {
        icon: '/model-mortage-logo.png',
        apple: '/model-mortage-logo.png',
    },
    openGraph: {
        title: 'Model Mortgage | Houston Mortgage Broker',
        description: 'Expert mortgage solutions in Houston, TX. Specializing in home loans, refinancing, FHA, VA, conventional, and jumbo mortgages. Call (832) 727-4128.',
        type: 'website',
        locale: 'en_US',
        url: 'https://modelmtg.com',
        siteName: 'Model Mortgage',
        images: [
            {
                url: '/model-mortage-logo.png',
                width: 1200,
                height: 630,
                alt: 'Model Mortgage - Houston Mortgage Broker',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Model Mortgage | Houston Mortgage Broker',
        description: 'Expert mortgage solutions in Houston, TX. Call (832) 727-4128 for home loans, refinancing, and more.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Replace with actual verification code
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FinancialService",
                "@id": "https://modelmtg.com/#organization",
                "name": "Model Mortgage",
                "alternateName": "Model Mtg",
                "description": "Professional mortgage broker serving Houston and surrounding areas. Specializing in home loans, refinancing, FHA, VA, conventional, jumbo mortgages, and investment property financing.",
                "url": "https://modelmtg.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://modelmtg.com/model-mortage-logo.png",
                    "width": 250,
                    "height": 60
                },
                "image": "https://modelmtg.com/model-mortage-logo.png",
                "telephone": "+18327274128",
                "email": "matthew@modelmtg.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "18 Augusta Pines Dr #203",
                    "addressLocality": "Spring",
                    "addressRegion": "TX",
                    "postalCode": "77389",
                    "addressCountry": "US"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "30.0902",
                    "longitude": "-95.4560"
                },
                "areaServed": [
                    {
                        "@type": "City",
                        "name": "Houston"
                    },
                    {
                        "@type": "City",
                        "name": "Spring"
                    },
                    {
                        "@type": "City",
                        "name": "The Woodlands"
                    },
                    {
                        "@type": "City",
                        "name": "Katy"
                    },
                    {
                        "@type": "City",
                        "name": "Sugar Land"
                    },
                    {
                        "@type": "State",
                        "name": "Texas"
                    }
                ],
                "priceRange": "$$",
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        "opens": "09:00",
                        "closes": "17:00"
                    }
                ],
                "sameAs": [
                    "https://www.facebook.com/model.mortgage/",
                    "https://www.instagram.com/modelmortgage",
                    "https://www.linkedin.com/company/modelmortgage"
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5.0",
                    "reviewCount": "10",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            },
            {
                "@type": "Person",
                "@id": "https://modelmtg.com/#matthew-bramow",
                "name": "Matthew Bramow",
                "jobTitle": "Mortgage Broker",
                "worksFor": {
                    "@id": "https://modelmtg.com/#organization"
                },
                "email": "matthew@modelmtg.com",
                "telephone": "+18327274128",
                "url": "https://modelmtg.com/matthew-bramow",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "18 Augusta Pines Dr #203",
                    "addressLocality": "Spring",
                    "addressRegion": "TX",
                    "postalCode": "77389",
                    "addressCountry": "US"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://modelmtg.com/#website",
                "url": "https://modelmtg.com",
                "name": "Model Mortgage",
                "description": "Houston mortgage broker specializing in home loans and refinancing",
                "publisher": {
                    "@id": "https://modelmtg.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://modelmtg.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Service",
                "@id": "https://modelmtg.com/#mortgage-services",
                "serviceType": "Mortgage Brokerage",
                "provider": {
                    "@id": "https://modelmtg.com/#organization"
                },
                "areaServed": {
                    "@type": "State",
                    "name": "Texas"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Mortgage Loan Products",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Conventional Mortgage Loans",
                                "description": "Fixed-rate and adjustable-rate conventional mortgage loans"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "FHA Loans",
                                "description": "Federal Housing Administration insured loans with low down payment options"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "VA Loans",
                                "description": "Veterans Affairs home loans for eligible service members and veterans"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Jumbo Loans",
                                "description": "Financing for high-value properties exceeding conforming loan limits"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Refinancing",
                                "description": "Rate and term refinancing, cash-out refinancing options"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Investment Property Loans",
                                "description": "Financing for rental properties and real estate investments"
                            }
                        }
                    ]
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://modelmtg.com/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://modelmtg.com"
                    }
                ]
            }
        ]
    }

    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </head>
            <body className="bg-mm-bg text-mm-text">
                {/* Skip to content link for accessibility */}
                <a href="#main-content" className="sr-only focus:not-sr-only">
                    Skip to main content
                </a>
                <ScrollToTop />
                {children}
            </body>
        </html>
    )
}
