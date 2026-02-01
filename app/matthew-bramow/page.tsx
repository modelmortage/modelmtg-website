import type { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { teamMembers } from '@/lib/content/teamMembers'
import styles from './profile.module.css'
import Link from 'next/link'

const member = teamMembers.find(m => m.slug === 'matthew-bramow')!

export const metadata: Metadata = {
  title: member.metadata.title,
  description: member.metadata.description,
  keywords: member.metadata.keywords.join(', '),
  openGraph: {
    title: member.metadata.title,
    description: member.metadata.description,
    type: 'profile',
    images: member.metadata.ogImage ? [{ url: member.metadata.ogImage }] : undefined,
  },
  alternates: {
    canonical: member.metadata.canonical,
  },
}

export default function MatthewBramowPage() {
  return (
    <>
      <ContentPage
        title={member.name}
        subtitle={member.title}
        breadcrumbs={[
          { label: 'Meet Our Team', href: '/meet-our-team' },
          { label: member.name, href: `/${member.slug}` }
        ]}
        cta={{
          title: 'Ready to Work Together?',
          description: 'Schedule a call with Matthew to discuss your mortgage needs and homeownership goals.',
          buttonText: 'Schedule a Call',
          buttonHref: member.contact.calendly || '/contact'
        }}
      >
      <div className={styles.profileGrid}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Photo */}
          <div className={styles.photoContainer}>
            <img
              src={member.photo}
              alt={`${member.name} - ${member.title}`}
              className={styles.photo}
            />
          </div>

          {/* Bio */}
          <section className={styles.bioSection}>
            <h2 className={styles.sectionHeading}>About {member.name.split(' ')[0]}</h2>
            {member.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </section>

          {/* Back to Team Link */}
          <div className={styles.backLink}>
            <Link href="/meet-our-team">← Back to Meet Our Team</Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Contact Card */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Contact Information</h3>
            <div className={styles.contactList}>
              {member.contact.email && (
                <a href={`mailto:${member.contact.email}`} className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email:</span>
                  <span className={styles.contactValue}>{member.contact.email}</span>
                </a>
              )}
              {member.contact.phone && (
                <a href={`tel:${member.contact.phone}`} className={styles.contactItem}>
                  <span className={styles.contactLabel}>Phone:</span>
                  <span className={styles.contactValue}>{member.contact.phone}</span>
                </a>
              )}
            </div>
            {member.contact.calendly && (
              <a href={member.contact.calendly} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Schedule a Call
              </a>
            )}
          </div>

          {/* Credentials Card */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Credentials</h3>
            <ul className={styles.list}>
              {member.credentials.map((credential, index) => (
                <li key={index} className={styles.listItem}>
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties Card */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Specialties</h3>
            <ul className={styles.list}>
              {member.specialties.map((specialty, index) => (
                <li key={index} className={styles.listItem}>
                  {specialty}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
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
              "name": "Meet Our Team",
              "item": "https://modelmtg.com/meet-our-team"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": member.name,
              "item": `https://modelmtg.com/${member.slug}`
            }
          ]
        })
      }}
    />
  </>
  )
}
