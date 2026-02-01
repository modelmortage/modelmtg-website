import { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { privacyPolicyContent } from '@/lib/content/privacyPolicy'
import styles from './privacy-policy.module.css'

export const metadata: Metadata = {
  title: privacyPolicyContent.metadata.title,
  description: privacyPolicyContent.metadata.description,
  keywords: privacyPolicyContent.metadata.keywords.join(', '),
  openGraph: {
    title: privacyPolicyContent.metadata.title,
    description: privacyPolicyContent.metadata.description,
    type: 'website',
    images: privacyPolicyContent.metadata.ogImage ? [{ url: privacyPolicyContent.metadata.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: privacyPolicyContent.metadata.title,
    description: privacyPolicyContent.metadata.description,
    images: privacyPolicyContent.metadata.ogImage ? [privacyPolicyContent.metadata.ogImage] : undefined,
  },
  alternates: {
    canonical: privacyPolicyContent.metadata.canonical,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      title={privacyPolicyContent.hero.title}
      subtitle={privacyPolicyContent.hero.subtitle}
    >
      {/* Last Updated */}
      <div className={styles.lastUpdated}>
        <p>
          <strong>Last Updated:</strong>{' '}
          {new Date(privacyPolicyContent.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Privacy Policy Content */}
      <div className={styles.policyContent}>
        {privacyPolicyContent.sections.map((section, index) => (
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
          If you have any questions about this Privacy Policy, please{' '}
          <a href="/contact" className={styles.contactLink}>contact us</a>.
        </p>
      </div>
    </ContentPage>
  )
}
