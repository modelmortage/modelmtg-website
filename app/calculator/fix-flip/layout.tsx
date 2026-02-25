import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Fix & Flip Calculator | Model Mortgage',
    description: 'Calculate potential returns on fix and flip investment properties in Houston, TX.',
    keywords: 'fix and flip, calculator, real estate, investment, Houston',
    openGraph: {
        title: 'Fix & Flip Calculator | Model Mortgage',
        description: 'Calculate potential returns on fix and flip investment properties in Houston, TX.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fix & Flip Calculator | Model Mortgage',
        description: 'Calculate potential returns on fix and flip investment properties.',
    },
    alternates: {
        canonical: '/calculator/fix-flip',
    },
}

export default function FixFlipCalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
