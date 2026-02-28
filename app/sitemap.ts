import { MetadataRoute } from 'next'
import { loanOptions } from '@/lib/content/loanOptions'

// Static blog slugs — update this list when adding new blog posts
const blogSlugs: { slug: string; publishDate: string }[] = [
  { slug: 'complete-guide-to-va-loans', publishDate: '2024-01-01' },
  { slug: 'credit-score-impact-on-mortgage-rates', publishDate: '2024-01-01' },
  { slug: 'down-payment-options-and-strategies', publishDate: '2024-01-01' },
  { slug: 'fha-vs-conventional-loans-which-is-right', publishDate: '2024-01-01' },
  { slug: 'first-time-homebuyer-checklist-houston', publishDate: '2024-01-01' },
  { slug: 'first-time-homebuyer-mistakes-to-avoid', publishDate: '2024-01-01' },
  { slug: 'how-much-house-can-i-afford', publishDate: '2024-01-01' },
  { slug: 'how-refinancing-works-in-texas', publishDate: '2024-01-01' },
  { slug: 'refinancing-your-mortgage-when-does-it-make-sense', publishDate: '2024-01-01' },
  { slug: 'step-by-step-guide-shopping-new-home', publishDate: '2024-01-01' },
  { slug: 'understanding-closing-costs-what-to-expect', publishDate: '2024-01-01' },
  { slug: 'understanding-mortgage-pre-approval', publishDate: '2024-01-01' },
  { slug: 'understanding-mortgage-rates-how-they-work', publishDate: '2024-01-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://modelmtg.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/meet-our-team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schedule-a-call`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ada-accessibility-statement`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pre-qualify`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Calculator pages
  const calculatorPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator/affordability`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator/purchase`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator/refinance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator/rent-vs-buy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator/va-purchase`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator/va-refinance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator/dscr`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator/fix-flip`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Team member pages
  const teamPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/matthew-bramow`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rolston-nicholls`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Blog pages
  const blogListingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning-center`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Individual blog posts (static list — no fs access needed for Edge Runtime)
  const blogPostPages: MetadataRoute.Sitemap = blogSlugs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Loan options hub page
  const loanOptionsHub: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/loan-options`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Individual loan option pages
  const loanOptionPages: MetadataRoute.Sitemap = loanOptions.map((option) => ({
    url: `${baseUrl}/loan-options/${option.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...calculatorPages,
    ...teamPages,
    ...blogListingPages,
    ...blogPostPages,
    ...loanOptionsHub,
    ...loanOptionPages,
  ]
}
