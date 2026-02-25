import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'
import styles from './ContentPage.module.css'

export interface ContentPageProps {
  /** Page title displayed in the hero section */
  title: string
  /** Optional subtitle or description */
  subtitle?: string
  /** Breadcrumb navigation items (Home is automatically prepended) */
  breadcrumbs?: BreadcrumbItem[]
  /** Main content of the page */
  children: React.ReactNode
  /** Optional hero background image */
  heroImage?: string
  /** Optional custom hero background color */
  heroBackground?: string
  /** Whether to show a CTA section at the bottom */
  showCTA?: boolean
  /** Custom CTA configuration */
  cta?: {
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }
  /** Optional CTA to display in the hero section */
  heroCta?: {
    text: string
    href: string
  }
}

export default function ContentPage({
  title,
  subtitle,
  breadcrumbs,
  children,
  heroImage,
  heroBackground,
  showCTA = true,
  heroCta,
  cta = {
    title: 'Ready to Get Started?',
    description: 'Contact us today to discuss your mortgage needs and get personalized guidance.',
    buttonText: 'Schedule a Call',
    buttonHref: '/schedule-a-call'
  }
}: ContentPageProps) {
  const heroStyle: React.CSSProperties = {
    background: heroBackground || 'var(--deep-charcoal)',
    ...(heroImage && {
      backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.8)), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })
  }

  return (
    <>
      <Header />
      <main id="main-content" className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero} style={heroStyle}>
          <div className={styles.heroContainer}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {heroCta && (
              <div className={styles.heroCtaContainer}>
                <a href={heroCta.href} className="btn btn-primary">
                  {heroCta.text}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className={styles.content}>
          <div className={styles.contentContainer}>
            {children}
          </div>
        </section>

        {/* CTA Section */}
        {showCTA && (
          <section className={styles.cta}>
            <div className={styles.ctaContainer}>
              <h2 className={styles.ctaTitle}>{cta.title}</h2>
              <p className={styles.ctaDescription}>{cta.description}</p>
              <a href={cta.buttonHref} className="btn btn-primary">
                {cta.buttonText}
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
