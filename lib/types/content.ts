// Content type definitions

export interface PageMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}

export interface LoanOption {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  benefits: string[]
  requirements: string[]
  idealFor: string[]
  icon: string
  relatedCalculators: string[]
  metadata: PageMetadata
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  featuredImage: string
  readTime: number
  metadata: PageMetadata
}

export interface TeamMember {
  slug: string
  name: string
  title: string
  bio: string
  photo: string
  credentials: string[]
  specialties: string[]
  contact: {
    email?: string
    phone?: string
    calendly?: string
  }
  metadata: PageMetadata
}

export interface ContentSection {
  heading: string
  content: string
  subsections?: ContentSection[]
}

export interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface PageContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage?: string
  }
  sections: ContentSection[]
  cta?: CallToAction
  sidebar?: {
    relatedLinks: Array<{ text: string; href: string }>
    contactInfo?: boolean
  }
}
