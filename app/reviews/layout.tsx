import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Client Reviews & Testimonials | Model Mortgage Houston',
    description: 'Read real reviews from Houston homebuyers and real estate investors who trusted Model Mortgage for their home loans and refinancing needs.',
    keywords: 'Model Mortgage reviews, Houston mortgage broker reviews, client testimonials, home loan reviews, mortgage lender ratings Houston',
    openGraph: {
        title: 'Client Reviews & Testimonials | Model Mortgage Houston',
        description: 'Read real reviews from Houston homebuyers and investors who trusted Model Mortgage.',
        type: 'website',
        url: 'https://modelmtg.com/reviews'
    },
    alternates: {
        canonical: 'https://modelmtg.com/reviews'
    }
}

export default function ReviewsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
