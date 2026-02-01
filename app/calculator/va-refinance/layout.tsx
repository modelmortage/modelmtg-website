import type { Metadata } from 'next'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'

export const metadata: Metadata = {
  title: vaRefinanceConfig.metadata.title,
  description: vaRefinanceConfig.metadata.description,
  keywords: vaRefinanceConfig.metadata.keywords.join(', '),
  openGraph: {
    title: vaRefinanceConfig.metadata.title,
    description: vaRefinanceConfig.metadata.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: vaRefinanceConfig.metadata.title,
    description: vaRefinanceConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/va-refinance',
  },
}

export default function VARefinanceCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
