import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
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
    title: 'Private Mortgage Advisory | Houston Mortgage Broker | Model Mortgage',
    description: 'Houston-based mortgage advisory specializing in structured lending for primary residences, investment properties, and jumbo homes. Private client approach with local expertise.',
    keywords: 'Houston mortgage broker, Texas home loans, mortgage strategist, Matthew Bramow, Model Mortgage, private mortgage advisory',
    authors: [{ name: 'Matthew Bramow' }],
    metadataBase: new URL('https://modelmtg.com'),
    icons: {
        icon: '/logo-v3.png',
        apple: '/logo-v3.png',
    },
    openGraph: {
        title: 'Private Mortgage Advisory | Houston Mortgage Broker',
        description: 'Houston-based mortgage advisory specializing in structured lending for primary residences, investment properties, and jumbo homes.',
        type: 'website',
        locale: 'en_US',
        images: [
            {
                url: '/logo-v3.png',
                width: 1200,
                height: 630,
                alt: 'Model Mortgage Logo',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Private Mortgage Advisory | Houston Mortgage Broker',
        description: 'Houston-based mortgage advisory specializing in structured lending.',
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
                "@type": "LocalBusiness",
                "@id": "https://modelmtg.com/#local-business",
                "name": "Model Mortgage",
                "description": "Private client mortgage advisory specializing in Houston",
                "url": "https://modelmtg.com",
                "telephone": "(832) 727-4128",
                "email": "info@modelmortgage.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "1177 West Loop South, Suite 1700",
                    "addressLocality": "Houston",
                    "addressRegion": "TX",
                    "postalCode": "77027",
                    "addressCountry": "US"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "29.7589",
                    "longitude": "-95.4086"
                },
                "areaServed": ["Houston", "River Oaks", "Memorial", "West University", "Sugar Land", "Katy", "Texas"],
                "image": "https://modelmtg.com/logo-v3.png",
                "sameAs": [
                    "https://www.facebook.com/modelmortgage",
                    "https://www.instagram.com/modelmortgage",
                    "https://www.linkedin.com/company/modelmortgage"
                ],
                "priceRange": "$$"
            },
            {
                "@type": "MortgageBroker",
                "@id": "https://modelmtg.com/#mortgage-broker",
                "name": "Model Mortgage",
                "loanTypes": ["Conventional", "FHA", "VA", "Jumbo", "USDA", "Refinance", "Investment Property"],
                "serviceArea": ["Houston", "TX"],
                "license": "Texas Mortgage Broker License #2516810",
                "url": "https://modelmtg.com"
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
            <body>
                {children}
            </body>
        </html>
    )
}
