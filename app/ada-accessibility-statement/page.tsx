import { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { adaAccessibilityContent } from '@/lib/content/adaAccessibility'
import styles from './ada-accessibility-statement.module.css'

export const metadata: Metadata = {
  title: adaAccessibilityContent.metadata.title,
  description: adaAccessibilityContent.metadata.description,
  keywords: adaAccessibilityContent.metadata.keywords.join(', '),
  openGraph: {
    title: adaAccessibilityContent.metadata.title,
    description: adaAccessibilityContent.metadata.description,
    type: 'website',
    images: adaAccessibilityContent.metadata.ogImage ? [{ url: adaAccessibilityContent.metadata.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: adaAccessibilityContent.metadata.title,
    description: adaAccessibilityContent.metadata.description,
    images: adaAccessibilityContent.metadata.ogImage ? [adaAccessibilityContent.metadata.ogImage] : undefined,
  },
  alternates: {
    canonical: adaAccessibilityContent.metadata.canonical,
  },
}

export default function AdaAccessibilityStatementPage() {
  return (
    <ContentPage
      title={adaAccessibilityContent.hero.title}
      subtitle={adaAccessibilityContent.hero.subtitle}
    >
      {/* Last Updated */}
      <div className={styles.lastUpdated}>
        <p>
          <strong>Last Updated:</strong>{' '}
          {new Date(adaAccessibilityContent.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Accessibility Statement Content */}
      <div className={styles.statementContent}>
        {adaAccessibilityContent.sections.map((section, index) => (
          <section key={index} className={styles.section}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}

            {section.subsections && (
              <div className={styles.subsections}>
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className={styles.subsection}>
                    <h3 className={styles.subsectionHeading}>{subsection.heading}</h3>
                    {subsection.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className={styles.paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Contact Notice */}
      <div className={styles.contactNotice}>
        <p>
          We are committed to accessibility. If you need assistance or have feedback,{' '}
          <a href="/contact" className={styles.contactLink}>please contact us</a>.
        </p>
      </div>
    </ContentPage>
  )
}
