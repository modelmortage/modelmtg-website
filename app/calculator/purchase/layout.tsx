import type { Metadata } from 'next'
import { purchaseConfig } from '@/lib/calculators/configs/purchase.config'

export const metadata: Metadata = {
  title: purchaseConfig.metadata.title,
  description: purchaseConfig.metadata.description,
  keywords: purchaseConfig.metadata.keywords.join(', '),
  openGraph: {
    title: purchaseConfig.metadata.title,
    description: purchaseConfig.metadata.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: purchaseConfig.metadata.title,
    description: purchaseConfig.metadata.description,
  },
  alternates: {
    canonical: '/calculator/purchase',
  },
}

export default function PurchaseCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
