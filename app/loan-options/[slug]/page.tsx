import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/shared/ContentPage'
import { loanOptions } from '@/lib/content/loanOptions'
import Link from 'next/link'
import styles from './LoanOptionPage.module.css'

interface LoanOptionPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all loan options
export async function generateStaticParams() {
  return loanOptions.map((option) => ({
    slug: option.slug,
  }))
}

// Generate metadata for each loan option page
export async function generateMetadata({ params }: LoanOptionPageProps): Promise<Metadata> {
  const loanOption = loanOptions.find((option) => option.slug === params.slug)

  if (!loanOption) {
    return {
      title: 'Loan Option Not Found',
      description: 'The requested loan option could not be found.',
    }
  }

  return {
    title: loanOption.metadata.title,
    description: loanOption.metadata.description,
    keywords: loanOption.metadata.keywords.join(', '),
    openGraph: {
      title: loanOption.metadata.title,
      description: loanOption.metadata.description,
      type: 'website',
      images: loanOption.metadata.ogImage ? [{ url: loanOption.metadata.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: loanOption.metadata.title,
      description: loanOption.metadata.description,
      images: loanOption.metadata.ogImage ? [loanOption.metadata.ogImage] : undefined,
    },
    alternates: {
      canonical: loanOption.metadata.canonical,
    },
  }
}

export default function LoanOptionPage({ params }: LoanOptionPageProps) {
  const loanOption = loanOptions.find((option) => option.slug === params.slug)

  if (!loanOption) {
    notFound()
  }

  // Map calculator slugs to display names and paths
  const calculatorMap: Record<string, { name: string; path: string }> = {
    'affordability': { name: 'Affordability Calculator', path: '/calculator/affordability' },
    'purchase': { name: 'Purchase Calculator', path: '/calculator/purchase' },
    'refinance': { name: 'Refinance Calculator', path: '/calculator/refinance' },
    'rent-vs-buy': { name: 'Rent vs Buy Calculator', path: '/calculator/rent-vs-buy' },
    'va-purchase': { name: 'VA Purchase Calculator', path: '/calculator/va-purchase' },
    'va-refinance': { name: 'VA Refinance Calculator', path: '/calculator/va-refinance' },
    'dscr': { name: 'DSCR Investment Calculator', path: '/calculator/dscr' },
  }

  return (
    <>
      <ContentPage
        title={loanOption.title}
        subtitle={loanOption.shortDescription}
        breadcrumbs={[
          { label: 'Loan Options', href: '/loan-options' },
          { label: loanOption.title, href: `/loan-options/${loanOption.slug}` },
        ]}
        cta={{
          title: 'Ready to Explore This Loan Option?',
          description: `Contact us today to learn more about ${loanOption.title} and see if it's the right fit for your needs.`,
          buttonText: 'Schedule a Call',
          buttonHref: '/schedule-a-call',
        }}
      >
      {/* Overview Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.overview}>
          {loanOption.fullDescription.split('\n\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Benefits</h2>
        <ul className={styles.list}>
          {loanOption.benefits.map((benefit, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.checkmark}>✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Requirements Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Requirements</h2>
        <ul className={styles.list}>
          {loanOption.requirements.map((requirement, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.bullet}>•</span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ideal For Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ideal For</h2>
        <ul className={styles.list}>
          {loanOption.idealFor.map((item, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.bullet}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Related Calculators Section */}
      {loanOption.relatedCalculators.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Related Calculators</h2>
          <p className={styles.paragraph}>
            Use these calculators to estimate your payments and explore your options:
          </p>
          <div className={styles.calculatorGrid}>
            {loanOption.relatedCalculators.map((calcSlug) => {
              const calculator = calculatorMap[calcSlug]
              if (!calculator) return null
              return (
                <Link
                  key={calcSlug}
                  href={calculator.path}
                  className={styles.calculatorCard}
                >
                  <span className={styles.calculatorIcon}>🧮</span>
                  <span className={styles.calculatorName}>{calculator.name}</span>
                  <span className={styles.calculatorArrow}>→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Next Steps Section */}
      <section className={styles.section}>
        <div className={styles.nextSteps}>
          <h2 className={styles.sectionTitle}>Next Steps</h2>
          <p className={styles.paragraph}>
            Ready to move forward with a {loanOption.title}? Here's how to get started:
          </p>
          <ol className={styles.orderedList}>
            <li className={styles.orderedListItem}>
              <strong>Schedule a consultation</strong> to discuss your specific situation and goals
            </li>
            <li className={styles.orderedListItem}>
              <strong>Get pre-approved</strong> to understand your buying power and strengthen your offer
            </li>
            <li className={styles.orderedListItem}>
              <strong>Find your home</strong> with confidence knowing your financing is secured
            </li>
            <li className={styles.orderedListItem}>
              <strong>Close on your loan</strong> with expert guidance every step of the way
            </li>
          </ol>
          <div className={styles.ctaButtons}>
            <Link href="/schedule-a-call" className="btn btn-primary">
              Schedule a Call
            </Link>
            <Link href="/loan-options" className="btn btn-secondary">
              View All Loan Options
            </Link>
          </div>
        </div>
      </section>
    </ContentPage>

    {/* Breadcrumb Structured Data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://modelmtg.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Loan Options",
              "item": "https://modelmtg.com/loan-options"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": loanOption.title,
              "item": `https://modelmtg.com/loan-options/${loanOption.slug}`
            }
          ]
        })
      }}
    />
  </>
  )
}
