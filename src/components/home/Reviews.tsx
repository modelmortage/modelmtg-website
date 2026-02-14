'use client'

import { getGoogleProof, Review } from '@/src/lib/proof'
import styles from './Reviews.module.css'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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


export function Reviews({ reviews: initialReviews = [] }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(initialReviews.length === 0)

  useEffect(() => {
    // Only fetch if we don't have initial reviews
    if (initialReviews.length === 0) {
      fetch('/api/google-reviews')
        .then(res => res.json())
        .then(data => {
          const transformedReviews = (data.reviews || []).map((review: any) => ({
            rating: review.rating || 5,
            author: review.authorName || 'Anonymous',
            text: review.text || '',
            date: review.relativeTime || review.time || 'Recent',
            profile_photo_url: review.authorPhoto || undefined,
            review_url: review.reviewUrl || undefined
          }))

          if (transformedReviews.length > 0) {
            setReviews(transformedReviews)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load reviews:', err)
          setLoading(false)
        })
    }
  }, [initialReviews.length])

  const proof = getGoogleProof(reviews)
  const displayReviews = reviews.slice(0, 5)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        {/* LEFT: Institutional Rating Block */}
        <div className={styles.ratingPanel}>
          <div className={styles.labelContainer}>
            <span className={styles.labelLine}></span>
            <span className={styles.label}>Trusted by Houston Homebuyers</span>
          </div>

          <div className={styles.ratingContainer}>
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
        <motion.div
          className={styles.cardsContainer}
          key={loading ? 'loading' : 'loaded'}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {loading ? (
            <div className={styles.noReviews}>
              <p>Loading reviews from Google...</p>
            </div>
          ) : displayReviews.length > 0 ? (
            <>
              {/* Card 1: Top Left */}
              {displayReviews[0] && (
                <motion.div
                  className={`${styles.reviewCard} ${styles.card1}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
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
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <a
                      href={displayReviews[0].review_url || "https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Card 2: Top Right */}
              {displayReviews[1] && (
                <motion.div
                  className={`${styles.reviewCard} ${styles.card2}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
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
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <a
                      href={displayReviews[1].review_url || "https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Card 3: Middle Left */}
              {displayReviews[2] && (
                <motion.div
                  className={`${styles.reviewCard} ${styles.card3}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
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
                      <div>
                        <h4 className={styles.authorName}>{displayReviews[2].author || 'Anonymous'}</h4>
                        <p className={styles.reviewDate}>{displayReviews[2].date || 'Recent'}</p>
                      </div>
                    </div>
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <a
                      href={displayReviews[2].review_url || "https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Card 4: Middle Right */}
              {displayReviews[3] && (
                <motion.div
                  className={`${styles.reviewCard} ${styles.card4}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <span className={styles.quoteIcon}>"</span>
                  <p className={styles.reviewText}>
                    {displayReviews[3].text}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <ReviewAvatar
                        url={displayReviews[3].profile_photo_url}
                        author={displayReviews[3].author || 'Anonymous'}
                        className={styles.authorImage}
                      />
                      <div>
                        <h4 className={styles.authorName}>{displayReviews[3].author || 'Anonymous'}</h4>
                        <p className={styles.reviewDate}>{displayReviews[3].date || 'Recent'}</p>
                      </div>
                    </div>
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <a
                      href={displayReviews[3].review_url || "https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Card 5: Bottom Center */}
              {displayReviews[4] && (
                <motion.div
                  className={`${styles.reviewCard} ${styles.card5}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <span className={styles.quoteIcon}>"</span>
                  <p className={styles.reviewText}>
                    {displayReviews[4].text}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <ReviewAvatar
                        url={displayReviews[4].profile_photo_url}
                        author={displayReviews[4].author || 'Anonymous'}
                        className={styles.authorImage}
                      />
                      <div>
                        <h4 className={styles.authorName}>{displayReviews[4].author || 'Anonymous'}</h4>
                        <p className={styles.reviewDate}>{displayReviews[4].date || 'Recent'}</p>
                      </div>
                    </div>
                    <div className={styles.reviewStars}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <a
                      href={displayReviews[4].review_url || "https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>View More</span>
                      <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className={styles.noReviews}>
              <p>Loading reviews from Google...</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

