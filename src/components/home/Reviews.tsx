'use client'

import { getGoogleProof, Review } from '@/src/lib/proof'
import styles from './Reviews.module.css'
import React from 'react'

interface ReviewsProps {
  reviews?: Review[]
}

interface ReviewAvatarProps {
  url?: string | null
  author: string
  className: string
}

function ReviewAvatar({ url, author, className }: ReviewAvatarProps) {
  // Use state to handle image loading errors
  const [imgError, setImgError] = React.useState(false)

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={author}
        className={className}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div className={className.replace('authorImage', 'authorInitial')}>
      {(author || 'A')[0].toUpperCase()}
    </div>
  )
}

/**
 * Reviews Section - Elite Editorial Layout
 * Asymmetric card positioning with institutional social proof
 */
export function Reviews({ reviews = [] }: ReviewsProps) {
  const proof = getGoogleProof(reviews)

  // Take first 3 reviews for display
  const displayReviews = reviews.slice(0, 3)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT: Institutional Rating Block */}
        <div className={styles.ratingPanel}>
          <div className={styles.labelContainer}>
            <span className={styles.labelLine}></span>
            <span className={styles.label}>Trusted by Houston Homebuyers</span>
          </div>

          <div className={styles.ratingContainer}>
            <h1 className={styles.ratingBackground}>5.0</h1>
            <div className={styles.ratingDisplay}>
              <span className={styles.ratingNumber}>
                {proof.rating !== null ? proof.rating : '5.0'}
              </span>
              <div className={styles.stars}>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
          </div>

          <div className={styles.quoteSection}>
            <p className={styles.tagline}>
              "Model Mortgage has consistently set the standard for high-net-worth lending in the Houston market."
            </p>
            <div className={styles.verifiedBadge}>
              <div className={styles.googleIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              </div>
              <div>
                <p className={styles.verifiedText}>Verified Google Reviews</p>
                <p className={styles.verifiedSubtext}>
                  Based on {proof.count !== null ? proof.count : '142'} client transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Asymmetric Editorial Cards */}
        <div className={styles.cardsContainer}>
          {displayReviews.length > 0 ? (
            <>
              {/* Card 1: Wide / Top Left */}
              {displayReviews[0] && (
                <div className={`${styles.reviewCard} ${styles.card1}`}>
                  <span className={styles.quoteIcon}>"</span>
                  <p className={styles.reviewText}>
                    {displayReviews[0].text}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <ReviewAvatar
                        url={displayReviews[0].profile_photo_url}
                        author={displayReviews[0].author || 'Anonymous'}
                        className={styles.authorImage}
                      />
                      <div>
                        <h4 className={styles.authorName}>{displayReviews[0].author || 'Anonymous'}</h4>
                        <p className={styles.reviewDate}>{displayReviews[0].date || 'Recent'}</p>
                      </div>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <span className={styles.externalIcon}>↗</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Card 2: Narrow/Tall / Mid Right */}
              {displayReviews[1] && (
                <div className={`${styles.reviewCard} ${styles.card2}`}>
                  <span className={styles.quoteIcon}>"</span>
                  <p className={styles.reviewText}>
                    {displayReviews[1].text}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <ReviewAvatar
                        url={displayReviews[1].profile_photo_url}
                        author={displayReviews[1].author || 'Anonymous'}
                        className={styles.authorImage}
                      />
                      <div>
                        <h4 className={styles.authorName}>{displayReviews[1].author || 'Anonymous'}</h4>
                        <p className={styles.reviewDate}>{displayReviews[1].date || 'Recent'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Medium / Bottom Left */}
              {displayReviews[2] && (
                <div className={`${styles.reviewCard} ${styles.card3}`}>
                  <span className={styles.quoteIcon}>"</span>
                  <p className={styles.reviewText}>
                    {displayReviews[2].text}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <ReviewAvatar
                        url={displayReviews[2].profile_photo_url}
                        author={displayReviews[2].author || 'Anonymous'}
                        className={styles.authorImage}
                      />
                      <h4 className={styles.authorName}>{displayReviews[2].author || 'Anonymous'}</h4>
                    </div>
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noReviews}>
              <p>Loading reviews from Google...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

