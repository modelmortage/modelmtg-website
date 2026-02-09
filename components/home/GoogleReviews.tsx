'use client'

import { useEffect, useState } from 'react'
import styles from './GoogleReviews.module.css'

interface Review {
    authorName: string
    authorPhoto: string | null
    rating: number
    text: string
    relativeTime: string
    time: string
}

interface ReviewsData {
    rating: number
    reviewCount: number
    reviews: Review[]
}

export default function GoogleReviews() {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch reviews on mount
    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch('/api/google-reviews')
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews')
                }
                const data = await response.json()
                setReviewsData(data)
                setIsLoading(false)
            } catch (err) {
                setError('Unable to load reviews')
                setIsLoading(false)
            }
        }

        fetchReviews()
    }, [])

    // Auto-rotate slides every 5 seconds
    useEffect(() => {
        if (!reviewsData || reviewsData.reviews.length === 0) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % reviewsData.reviews.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [reviewsData])

    // Render star rating
    const renderStars = (rating: number) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? styles.starFilled : styles.starEmpty}
                    >
                        ★
                    </span>
                ))}
            </div>
        )
    }

    if (isLoading) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading reviews...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (error || !reviewsData || reviewsData.reviews.length === 0) {
        return null // Silently fail - don't show broken section
    }

    const reviews = reviewsData.reviews.slice(0, 5) // Limit to 5 reviews

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Trusted by Our Clients</h2>
                    <div className={styles.aggregateRating}>
                        {renderStars(Math.round(reviewsData.rating))}
                        <span className={styles.ratingText}>
                            {reviewsData.rating.toFixed(1)} ({reviewsData.reviewCount}+ Google Reviews)
                        </span>
                    </div>
                </div>

                {/* Slideshow */}
                <div className={styles.slideshow}>
                    <div className={styles.slidesContainer}>
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className={`${styles.slide} ${index === currentSlide ? styles.active : ''
                                    }`}
                            >
                                <div className={styles.card}>
                                    {/* Review Header */}
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.authorInfo}>
                                            {review.authorPhoto ? (
                                                <img
                                                    src={review.authorPhoto}
                                                    alt={review.authorName}
                                                    className={styles.authorPhoto}
                                                />
                                            ) : (
                                                <div className={styles.authorPhotoPlaceholder}>
                                                    {review.authorName.charAt(0)}
                                                </div>
                                            )}
                                            <div className={styles.authorDetails}>
                                                <div className={styles.authorName}>
                                                    {review.authorName}
                                                </div>
                                                <div className={styles.reviewTime}>
                                                    {review.relativeTime}
                                                </div>
                                            </div>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* Review Text */}
                                    <p className={styles.reviewText}>
                                        {review.text.length > 300
                                            ? review.text.slice(0, 300) + '...'
                                            : review.text}
                                    </p>

                                    {/* Google Logo */}
                                    <div className={styles.googleBadge}>
                                        <svg viewBox="0 0 24 24" className={styles.googleIcon}>
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span>Google Review</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className={styles.navigation}>
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''
                                    }`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
