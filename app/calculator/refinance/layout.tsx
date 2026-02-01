import type { Metadata } from 'next'
import { refinanceConfig } from '@/lib/calculators/configs/refinance.config'

export const metadata: Metadata = {
  title: refinanceConfig.metadata.title,
  description: refinanceConfig.metadata.description,
  keywords: refinanceConfig.metadata.keywords.join(', '),
  openGraph: {
    title: refinanceConfig.metadata.title,
    description: refinanceConfig.metadata.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: refinanceConfig.metadata.title,
    description: refinanceConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/refinance',
  },
}

export default function RefinanceCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
