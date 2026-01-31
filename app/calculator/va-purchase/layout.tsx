import type { Metadata } from 'next'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'

export const metadata: Metadata = {
  title: vaPurchaseConfig.metadata.title,
  description: vaPurchaseConfig.metadata.description,
  keywords: vaPurchaseConfig.metadata.keywords.join(', '),
  openGraph: {
    title: vaPurchaseConfig.metadata.title,
    description: vaPurchaseConfig.metadata.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: vaPurchaseConfig.metadata.title,
    description: vaPurchaseConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/va-purchase',
  },
}

export default function VAPurchaseCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
