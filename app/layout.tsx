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
    title: 'Matthew Bramow | Houston Mortgage Strategist | Model Mortgage',
    description: 'Strategic mortgage planning for buyers who refuse to lose. Expert Houston mortgage broker specializing in purchase loans, refinancing, and luxury homes.',
    keywords: 'Houston mortgage broker, Texas home loans, mortgage strategist, Matthew Bramow, Model Mortgage, best mortgage lender Houston',
    authors: [{ name: 'Matthew Bramow' }],
    metadataBase: new URL('https://modelmtg.com'),
    icons: {
        icon: '/logo-v3.png',
        apple: '/logo-v3.png',
    },
    openGraph: {
        title: 'Matthew Bramow | Houston Mortgage Strategist',
        description: 'Strategic mortgage planning for buyers who refuse to lose. Expert Houston mortgage broker specializing in purchase loans, refinancing, and luxury homes.',
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
        title: 'Matthew Bramow | Houston Mortgage Strategist',
        description: 'Strategic mortgage planning for buyers who refuse to lose. Expert Houston mortgage broker.',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <head>
                {/* Icons are handled by the metadata API */}
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
