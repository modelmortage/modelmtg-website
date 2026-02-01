import type { Metadata } from 'next'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'

export const metadata: Metadata = {
  title: rentVsBuyConfig.metadata.title,
  description: rentVsBuyConfig.metadata.description,
  keywords: rentVsBuyConfig.metadata.keywords.join(', '),
  openGraph: {
    title: rentVsBuyConfig.metadata.title,
    description: rentVsBuyConfig.metadata.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: rentVsBuyConfig.metadata.title,
    description: rentVsBuyConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/rent-vs-buy',
  },
}

export default function RentVsBuyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
