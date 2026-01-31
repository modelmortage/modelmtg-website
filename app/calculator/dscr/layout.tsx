import type { Metadata } from 'next'
import { dscrConfig } from '@/lib/calculators/configs/dscr.config'

export const metadata: Metadata = {
  title: dscrConfig.metadata.title,
  description: dscrConfig.metadata.description,
  keywords: dscrConfig.metadata.keywords.join(', '),
  openGraph: {
    title: dscrConfig.metadata.title,
    description: dscrConfig.metadata.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: dscrConfig.metadata.title,
    description: dscrConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/dscr',
  },
}

export default function DSCRCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
