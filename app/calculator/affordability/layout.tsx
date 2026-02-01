import type { Metadata } from 'next'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'

export const metadata: Metadata = {
  title: affordabilityConfig.metadata.title,
  description: affordabilityConfig.metadata.description,
  keywords: affordabilityConfig.metadata.keywords.join(', '),
  openGraph: {
    title: affordabilityConfig.metadata.title,
    description: affordabilityConfig.metadata.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: affordabilityConfig.metadata.title,
    description: affordabilityConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/affordability',
  },
}

export default function AffordabilityCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
