import { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { reviewsContent } from '@/lib/content/reviews'
import { Card } from '@/components/design-system/Card'
import { Icon } from '@/components/design-system/Icon'
import { getIcon } from '@/lib/utils/iconMap'
import { FaStar } from 'react-icons/fa'
import styles from './reviews.module.css'

export const metadata: Metadata = {
  title: reviewsContent.metadata.title,
  description: reviewsContent.metadata.description,
  keywords: reviewsContent.metadata.keywords.join(', '),
  openGraph: {
    title: reviewsContent.metadata.title,
    description: reviewsContent.metadata.description,
    type: 'website',
    images: reviewsContent.metadata.ogImage ? [{ url: reviewsContent.metadata.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: reviewsContent.metadata.title,
    description: reviewsContent.metadata.description,
    images: reviewsContent.metadata.ogImage ? [reviewsContent.metadata.ogImage] : undefined,
  },
  alternates: {
    canonical: reviewsContent.metadata.canonical,
  },
}

export default function ReviewsPage() {
  return (
    <ContentPage
      title={reviewsContent.hero.title}
      subtitle={reviewsContent.hero.subtitle}
    >
      {/* Introduction */}
      <section className={styles.introduction}>
        <p>{reviewsContent.introduction}</p>
      </section>

      {/* Overall Rating */}
      <section className={styles.overallRating}>
        <Card variant="elevated" padding="lg">
          <div className={styles.ratingDisplay}>
            <div className={styles.ratingValue}>{reviewsContent.overallRating.value.toFixed(1)}</div>
            <div className={styles.ratingDetails}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} icon={FaStar} size="md" />
                ))}
              </div>
              <p className={styles.ratingText}>
                Based on {reviewsContent.overallRating.count.toLocaleString()}+ reviews
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Reviews Grid */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
        <div className={styles.reviewsGrid}>
          {reviewsContent.reviews.map((review) => (
            <Card key={review.id} variant="elevated" padding="lg" hoverable>
              <article className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewStars}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} icon={FaStar} size="sm" />
                    ))}
                  </div>
                  {review.loanType && (
                    <span className={styles.loanType}>{review.loanType}</span>
                  )}
                </div>
                <p className={styles.reviewText}>
                  <span className={styles.quote}>"</span>
                  {review.text}
                  <span className={styles.quote}>"</span>
                </p>
                <div className={styles.reviewFooter}>
                  <div className={styles.clientInfo}>
                    <div className={styles.clientAvatar}>
                      {review.name.split(' ')[0][0]}
                      {review.name.split(' ')[review.name.split(' ').length - 1][0]}
                    </div>
                    <div className={styles.clientDetails}>
                      <p className={styles.clientName}>{review.name}</p>
                      <p className={styles.clientLocation}>{review.location}</p>
                    </div>
                  </div>
                  <time className={styles.reviewDate} dateTime={review.date}>
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </time>
                </div>
              </article>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustSection}>
        <h2 className={styles.sectionTitle}>Licensed & Certified</h2>
        <div className={styles.badgesGrid}>
          {reviewsContent.trustBadges.map((badge, index) => {
            const IconComponent = getIcon(badge.iconName);
            return (
              <Card key={index} variant="outlined" padding="md">
                <div className={styles.badge}>
                  {IconComponent && (
                    <div className={styles.badgeIcon}>
                      <Icon icon={IconComponent} size="lg" ariaLabel={badge.name} />
                    </div>
                  )}
                  <div className={styles.badgeInfo}>
                    <p className={styles.badgeName}>{badge.name}</p>
                    <p className={styles.badgeDescription}>{badge.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Structured Data for Reviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Model Mortgage",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": reviewsContent.overallRating.value.toString(),
              "reviewCount": reviewsContent.overallRating.count.toString(),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": reviewsContent.reviews.map(review => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.name
              },
              "datePublished": review.date,
              "reviewBody": review.text,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating.toString(),
                "bestRating": "5",
                "worstRating": "1"
              }
            }))
          })
        }}
      />
    </ContentPage>
  )
}
