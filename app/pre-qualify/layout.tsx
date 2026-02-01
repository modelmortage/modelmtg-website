import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Pre-Approved for a Mortgage | Fast Pre-Qualification | Model Mortgage',
  description: 'Get pre-approved for a mortgage in minutes. Free, fast pre-qualification with no credit impact. Strengthen your offer and shop with confidence in Houston, TX.',
  keywords: 'mortgage pre-approval, pre-qualification, get pre-approved, mortgage pre-approval Houston, home loan pre-approval Texas, fast pre-approval',
  openGraph: {
    title: 'Get Pre-Approved for a Mortgage | Model Mortgage',
    description: 'Get pre-approved for a mortgage in minutes. Free, fast pre-qualification with no credit impact.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Pre-Approved for a Mortgage | Model Mortgage',
    description: 'Get pre-approved for a mortgage in minutes. Free, fast pre-qualification with no credit impact.',
  },
  alternates: {
    canonical: '/pre-qualify',
  },
}

export default function PreQualifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
