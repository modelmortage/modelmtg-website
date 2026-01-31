// SEO utility functions

import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  article?: {
    publishedTime: string
    author: string
    tags: string[]
  }
}

/**
 * Generate Next.js metadata object from SEO configuration
 * @param config - SEO configuration object
 * @returns Next.js Metadata object
 */
export function generateMetadata(config: SEOConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      type: config.ogType || 'website',
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    alternates: {
      canonical: config.canonical,
    },
  }
}

/**
 * Generate JSON-LD structured data for Organization
 * @param data - Organization data
 * @returns JSON-LD script content
 */
export function generateOrganizationSchema(data: {
  name: string
  url: string
  logo: string
  description: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    address: data.address ? {
      '@type': 'PostalAddress',
      ...data.address,
    } : undefined,
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      ...data.contactPoint,
    } : undefined,
  }
}

/**
 * Generate JSON-LD structured data for Article
 * @param data - Article data
 * @returns JSON-LD script content
 */
export function generateArticleSchema(data: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo,
      },
    },
  }
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 * @param items - Array of breadcrumb items
 * @returns JSON-LD script content
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate structured data script tag
 * @param schema - JSON-LD schema object
 * @returns Script tag string
 */
export function generateStructuredData(
  type: 'article' | 'organization' | 'breadcrumb',
  data: any
): string {
  let schema
  
  switch (type) {
    case 'article':
      schema = generateArticleSchema(data)
      break
    case 'organization':
      schema = generateOrganizationSchema(data)
      break
    case 'breadcrumb':
      schema = generateBreadcrumbSchema(data)
      break
    default:
      throw new Error(`Unknown schema type: ${type}`)
  }
  
  return JSON.stringify(schema)
}
