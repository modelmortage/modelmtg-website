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
    description: 'Strategic mortgage planning for buyers who refuse to lose. Expert mortgage broker in Houston, TX specializing in purchase loans, refinancing, and luxury home financing.',
    keywords: 'Houston mortgage broker, Texas home loans, mortgage strategist, Matthew Bramow, Model Mortgage, best mortgage lender Houston',
    authors: [{ name: 'Matthew Bramow' }],
    openGraph: {
        title: 'Matthew Bramow | Houston Mortgage Strategist',
        description: 'Strategic mortgage planning for buyers who refuse to lose.',
        type: 'website',
        locale: 'en_US',
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
                <link rel="icon" href="/logo.png" />
            </head>
            <body>{children}</body>
        </html>
    )
}
