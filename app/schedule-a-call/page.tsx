import type { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { scheduleCallContent } from '@/lib/content/scheduleCall'
import { Card } from '@/components/design-system/Card'
import { Icon } from '@/components/design-system/Icon'
import { getIcon } from '@/lib/utils/iconMap'
import styles from './schedule-a-call.module.css'

export const metadata: Metadata = {
  title: scheduleCallContent.metadata.title,
  description: scheduleCallContent.metadata.description,
  keywords: scheduleCallContent.metadata.keywords.join(', '),
  openGraph: {
    title: scheduleCallContent.metadata.title,
    description: scheduleCallContent.metadata.description,
    type: 'website',
    images: scheduleCallContent.metadata.ogImage ? [{ url: scheduleCallContent.metadata.ogImage }] : undefined,
  },
  alternates: {
    canonical: scheduleCallContent.metadata.canonical,
  },
}

export default function ScheduleCallPage() {
  return (
    <ContentPage
      title={scheduleCallContent.hero.title}
      subtitle={scheduleCallContent.hero.subtitle}
    >
      {/* Introduction */}
      <div className={styles.intro}>
        <p className={styles.introText}>{scheduleCallContent.intro}</p>
      </div>

      {/* Scheduling Options */}
      <section className={styles.schedulingSection}>
        <h2 className={styles.sectionHeading}>Choose How to Connect</h2>
        <div className={styles.optionsGrid}>
          {scheduleCallContent.schedulingOptions.map((option, index) => {
            const IconComponent = getIcon(option.iconName);
            return (
              <Card key={index} variant="elevated" padding="lg" hoverable>
                <article className={styles.optionCard}>
                  {IconComponent && (
                    <div className={styles.optionIcon}>
                      <Icon icon={IconComponent} size="xl" ariaLabel={option.title} />
                    </div>
                  )}
                  <h3 className={styles.optionTitle}>{option.title}</h3>
                  <p className={styles.optionDescription}>{option.description}</p>
                  <a
                    href={option.action.href}
                    className={styles.optionButton}
                    target={option.action.href.startsWith('http') ? '_blank' : undefined}
                    rel={option.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {option.action.text}
                  </a>
                </article>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionHeading}>What to Expect</h2>
        <div className={styles.benefitsGrid}>
          {scheduleCallContent.benefits.map((benefit, index) => {
            const IconComponent = getIcon(benefit.iconName);
            return (
              <Card key={index} variant="outlined" padding="md">
                <div className={styles.benefitCard}>
                  {IconComponent && (
                    <div className={styles.benefitIcon}>
                      <Icon icon={IconComponent} size="lg" />
                    </div>
                  )}
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Calendly Embed Section (Optional) */}
      {scheduleCallContent.calendlyUrl && (
        <section className={styles.calendlySection}>
          <h2 className={styles.sectionHeading}>Schedule Online</h2>
          <p className={styles.calendlyIntro}>
            Select a convenient time from Matthew's calendar below:
          </p>
          <div className={styles.calendlyEmbed}>
            <iframe
              src={scheduleCallContent.calendlyUrl}
              width="100%"
              height="700"
              frameBorder="0"
              title="Schedule a consultation with Model Mortgage"
            />
          </div>
        </section>
      )}

      {/* Additional Info */}
      <section className={styles.infoSection}>
        <Card variant="outlined" padding="lg" className={styles.infoCard}>
          <h3 className={styles.infoHeading}>Business Hours</h3>
          <p className={styles.infoText}>
            Monday - Friday: 8:00 AM - 7:00 PM<br />
            Saturday: 9:00 AM - 5:00 PM<br />
            Sunday: By Appointment Only
          </p>
        </Card>
        <Card variant="outlined" padding="lg" className={styles.infoCard}>
          <h3 className={styles.infoHeading}>Location</h3>
          <p className={styles.infoText}>
            Houston, TX<br />
            Serving all of Texas<br />
            Virtual consultations available
          </p>
        </Card>
        <Card variant="outlined" padding="lg" className={styles.infoCard}>
          <h3 className={styles.infoHeading}>Company Information</h3>
          <p className={styles.infoText}>
            Model Mortgage<br />
            NMLS: 2516810<br />
            Licensed in Texas
          </p>
        </Card>
      </section>
    </ContentPage>
  )
}
