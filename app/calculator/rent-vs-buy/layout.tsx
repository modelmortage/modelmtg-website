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
}

export default function RentVsBuyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
