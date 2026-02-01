import { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { reviewsContent } from '@/lib/content/reviews'
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
        <div className={styles.ratingDisplay}>
          <div className={styles.ratingValue}>{reviewsContent.overallRating.value.toFixed(1)}</div>
          <div className={styles.ratingDetails}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <p className={styles.ratingText}>
              Based on {reviewsContent.overallRating.count.toLocaleString()}+ reviews
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
        <div className={styles.reviewsGrid}>
          {reviewsContent.reviews.map((review) => (
            <article key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewStars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className={styles.reviewStar}>★</span>
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
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustSection}>
        <h2 className={styles.sectionTitle}>Licensed & Certified</h2>
        <div className={styles.badgesGrid}>
          {reviewsContent.trustBadges.map((badge, index) => (
            <div key={index} className={styles.badge}>
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <div className={styles.badgeInfo}>
                <p className={styles.badgeName}>{badge.name}</p>
                <p className={styles.badgeDescription}>{badge.description}</p>
              </div>
            </div>
          ))}
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
