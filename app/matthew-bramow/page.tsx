import type { Metadata } from 'next'
import Image from 'next/image'
import ContentPage from '@/components/shared/ContentPage'
import { teamMembers } from '@/lib/content/teamMembers'
import styles from './profile.module.css'
import Link from 'next/link'
import { FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle, FaStar, FaArrowLeft } from 'react-icons/fa'

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
            <Image
              src={member.photo}
              alt={`${member.name} - ${member.title}`}
              width={400}
              height={400}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjdmNyIvPjwvc3ZnPg=="
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
            <Link href="/meet-our-team">
              <FaArrowLeft className={styles.backIcon} aria-hidden="true" />
              Back to Meet Our Team
            </Link>
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
                  <div className={styles.contactIcon}>
                    <FaEnvelope />
                  </div>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>Email</span>
                    <span className={styles.contactValue}>{member.contact.email}</span>
                  </div>
                </a>
              )}
              {member.contact.phone && (
                <a href={`tel:${member.contact.phone}`} className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <FaPhone />
                  </div>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>Phone</span>
                    <span className={styles.contactValue}>{member.contact.phone}</span>
                  </div>
                </a>
              )}
            </div>
            {member.contact.calendly && (
              <a href={member.contact.calendly} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <FaCalendarAlt />
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
                  <FaCheckCircle className={styles.listIcon} aria-hidden="true" />
                  <span>{credential}</span>
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
                  <FaStar className={styles.listIcon} aria-hidden="true" />
                  <span>{specialty}</span>
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
