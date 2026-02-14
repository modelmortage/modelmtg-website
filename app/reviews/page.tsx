'use client'

import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import styles from './reviews.module.css'

interface Review {
  authorName: string
  authorPhoto: string | null
  rating: number
  text: string
  relativeTime: string
  time: string
}

interface ReviewAvatarProps {
  url?: string | null
  author: string
}

function ReviewAvatar({ url, author }: ReviewAvatarProps) {
  const [imgError, setImgError] = useState(false)

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={author}
        className={styles.authorImage}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div className={styles.authorInitial}>
      {(author || 'A')[0].toUpperCase()}
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number>(5.0)
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)

    // Fetch Google reviews
    fetch('/api/google-reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || [])
        setRating(data.rating || 5.0)
        setReviewCount(data.reviewCount || 0)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load reviews:', err)
        setLoading(false)
      })

    return () => {
      // Cleanup script on unmount
      const scripts = document.querySelectorAll('script[src="https://elfsightcdn.com/platform.js"]')
      scripts.forEach(s => s.remove())
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.labelContainer}>
              <span className={styles.labelLine}></span>
              <span className={styles.heroLabel}>Client Testimonials</span>
            </div>
            <h1 className={styles.heroTitle}>
              Client <span className={styles.heroTitleAccent}>Reviews</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Real feedback from Houston homebuyers and investors who trusted Model Mortgage with their financing strategy.
            </p>

            {/* Rating Summary */}
            <div className={styles.ratingSummary}>
              <div className={styles.ratingDisplay}>
                <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <div className={styles.ratingMeta}>
                <p className={styles.ratingCount}>Based on {reviewCount} Google Reviews</p>
                <a
                  href="https://maps.app.goo.gl/35L6crTX7ygjNAJ4A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.googleLink}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.googleIcon}>
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  View on Google
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className={styles.reviewsSection}>
          <div className={styles.reviewsContainer}>
            {loading ? (
              <div className={styles.loading}>
                <p>Loading reviews from Google...</p>
              </div>
            ) : reviews.length > 0 ? (
              <motion.div
                className={styles.reviewsGrid}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    className={styles.reviewCard}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.authorInfo}>
                        <ReviewAvatar
                          url={review.authorPhoto}
                          author={review.authorName}
                        />
                        <div className={styles.authorDetails}>
                          <h3 className={styles.authorName}>{review.authorName}</h3>
                          <p className={styles.reviewDate}>{review.relativeTime}</p>
                        </div>
                      </div>
                      <div className={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{review.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className={styles.noReviews}>
                <p>No reviews available at this time.</p>
              </div>
            )}

            {/* Elfsight All-in-One Reviews Widget (Zillow) */}
            <div className={styles.elfsightWidget}>
              <h2 className={styles.widgetTitle}>More Client Reviews</h2>
              <div className="elfsight-app-4222637f-f2ae-46fa-a51b-ac25d83cd4be" data-elfsight-app-lazy></div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <span className={styles.ctaLabel}>Join Our Clients</span>
            <h2 className={styles.ctaTitle}>Experience the Model Mortgage Difference</h2>
            <p className={styles.ctaSubtitle}>
              Let us help you structure your next mortgage with the same precision and care our clients have come to expect.
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://2516810.my1003app.com/?time=1702581789975"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                Start Your Application
              </a>
              <a href="/contact" className={styles.ctaButtonSecondary}>
                Contact Our Team
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
