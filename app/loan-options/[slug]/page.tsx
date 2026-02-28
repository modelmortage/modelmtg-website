import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/shared/ContentPage'
import { loanOptions } from '@/lib/content/loanOptions'
import Link from 'next/link'
import InlineCta from '@/components/shared/InlineCta'
import { safeJsonLd } from '@/lib/safeJsonLd'
import { Card, Icon, Button } from '@/components/design-system'
import {
  FaCheckCircle,
  FaCircle,
  FaCalculator,
  FaArrowRight,
  FaCreditCard,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaTimes,
  FaQuestionCircle,
  FaExchangeAlt
} from 'react-icons/fa'
import styles from './LoanOptionPage.module.css'

export const dynamic = 'force-static'
export const dynamicParams = false

interface LoanOptionPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all loan options
export async function generateStaticParams() {
  return loanOptions.map((option) => ({
    slug: option.slug,
  }))
}

// Generate metadata for each loan option page
export async function generateMetadata({ params }: LoanOptionPageProps): Promise<Metadata> {
  const { slug } = await params
  const loanOption = loanOptions.find((option) => option.slug === slug)

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

export default async function LoanOptionPage({ params }: LoanOptionPageProps) {
  const { slug } = await params
  const loanOption = loanOptions.find((option) => option.slug === slug)

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
        heroBackground="var(--midnight-black)"
        breadcrumbs={[
          { label: 'Loan Options', href: '/loan-options' },
          { label: loanOption.title, href: `/loan-options/${loanOption.slug}` },
        ]}
        heroCta={{
          text: 'Get Pre-Approved',
          href: '/pre-qualify',
        }}
        cta={{
          title: 'Ready to Explore This Loan Option?',
          description: `Contact us today to learn more about ${loanOption.title} and see if it's the right fit for your needs.`,
          buttonText: 'Schedule a Call',
          buttonHref: '/schedule-a-call',
        }}
      >
        {/* Quick Facts Section */}
        {(loanOption.minimumCreditScore || loanOption.downPayment || loanOption.closingTimeline) && (
          <section className={styles.section}>
            <div className={styles.quickFactsGrid}>
              {loanOption.minimumCreditScore && (
                <div className={styles.factCard}>
                  <div className={styles.factLabel}>Minimum Credit Score</div>
                  <div className={styles.factValue}>
                    <Icon icon={FaCreditCard} size="md" className={styles.calculatorIcon} />
                    {loanOption.minimumCreditScore}
                  </div>
                </div>
              )}
              {loanOption.downPayment && (
                <div className={styles.factCard}>
                  <div className={styles.factLabel}>Down Payment</div>
                  <div className={styles.factValue}>
                    <Icon icon={FaMoneyBillWave} size="md" className={styles.calculatorIcon} />
                    {loanOption.downPayment}
                  </div>
                </div>
              )}
              {loanOption.closingTimeline && (
                <div className={styles.factCard}>
                  <div className={styles.factLabel}>Typical Timeline</div>
                  <div className={styles.factValue}>
                    <Icon icon={FaClock} size="md" className={styles.calculatorIcon} />
                    {loanOption.closingTimeline}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

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
                <Icon
                  icon={FaCheckCircle}
                  size="md"
                  className={styles.checkIcon}
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Who Qualifies Section */}
        {loanOption.whoQualifies && loanOption.whoQualifies.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Who Qualifies?</h2>
            <ul className={styles.list}>
              {loanOption.whoQualifies.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  <Icon
                    icon={FaCircle}
                    size="sm"
                    className={styles.bulletIcon}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements</h2>
          <ul className={styles.list}>
            {loanOption.requirements.map((requirement, index) => (
              <li key={index} className={styles.listItem}>
                <Icon
                  icon={FaCircle}
                  size="sm"
                  className={styles.bulletIcon}
                />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mid-page Inline CTA */}
        <InlineCta
          title="Find Out If You Qualify"
          description={`Our team can help you navigate ${loanOption.title} requirements and secure the best possible rate.`}
          buttonText="Get Pre-Approved"
          buttonHref="/pre-qualify"
        />

        {/* Pros & Cons Section */}
        {((loanOption.pros && loanOption.pros.length > 0) || (loanOption.cons && loanOption.cons.length > 0)) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pros & Cons</h2>
            <div className={styles.prosConsGrid}>
              {loanOption.pros && loanOption.pros.length > 0 && (
                <div className={styles.proCard}>
                  <div className={styles.proTitle}>
                    <Icon icon={FaCheck} size="md" />
                    Advantages
                  </div>
                  <ul className={styles.list}>
                    {loanOption.pros.map((pro, index) => (
                      <li key={`pro-${index}`} className={styles.listItem}>
                        <Icon icon={FaCircle} size="sm" className={styles.blackBullet} />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {loanOption.cons && loanOption.cons.length > 0 && (
                <div className={styles.conCard}>
                  <div className={styles.conTitle}>
                    <Icon icon={FaTimes} size="md" />
                    Drawbacks
                  </div>
                  <ul className={styles.list}>
                    {loanOption.cons.map((con, index) => (
                      <li key={`con-${index}`} className={styles.listItem}>
                        <Icon icon={FaCircle} size="sm" className={styles.blackBullet} />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* What to Expect Timeline Section */}
        {loanOption.whatToExpect && loanOption.whatToExpect.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What to Expect</h2>
            <div className={styles.timelineList}>
              {loanOption.whatToExpect.map((step, index) => (
                <div key={index} className={styles.timelineItem}>
                  {step}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compare Loan Options Section */}
        {loanOption.comparison && loanOption.comparison.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Compare Loan Options</h2>
            <div className={styles.comparisonGrid}>
              {loanOption.comparison.map((comp, index) => (
                <div key={index} className={styles.compareCard}>
                  <div className={styles.compareTitle}>
                    <Icon icon={FaExchangeAlt} size="md" className={styles.calculatorIcon} />
                    {comp.title}
                  </div>
                  <p className={styles.compareDesc}>{comp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {loanOption.faqs && loanOption.faqs.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div>
              {loanOption.faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <div className={styles.faqQuestion}>
                    <Icon icon={FaQuestionCircle} size="md" className={styles.calculatorIcon} />
                    <span>{faq.question}</span>
                  </div>
                  <div className={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ideal For Section */}
        {loanOption.idealFor && loanOption.idealFor.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ideal For</h2>
            <ul className={styles.list}>
              {loanOption.idealFor.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  <Icon
                    icon={FaCircle}
                    size="sm"
                    className={styles.bulletIcon}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Calculators Section */}
        {loanOption.relatedCalculators && loanOption.relatedCalculators.length > 0 && (
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
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      variant="outlined"
                      padding="md"
                      hoverable
                      className={styles.calculatorCard}
                    >
                      <Icon
                        icon={FaCalculator}
                        size="lg"
                        className={styles.calculatorIcon}
                      />
                      <span className={styles.calculatorName}>{calculator.name}</span>
                      <Icon
                        icon={FaArrowRight}
                        size="md"
                        className={styles.calculatorArrow}
                      />
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Next Steps Section */}
        <section className={styles.section}>
          <Card variant="flat" padding="lg" className={styles.nextStepsCard}>
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
              <Link href="/schedule-a-call" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" fullWidth>
                  Schedule a Call
                </Button>
              </Link>
              <Link href="/loan-options" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="lg" fullWidth>
                  View All Loan Options
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </ContentPage>

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
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

      {/* FAQ Structured Data */}
      {loanOption.faqs && loanOption.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": loanOption.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      )}
    </>
  )
}
