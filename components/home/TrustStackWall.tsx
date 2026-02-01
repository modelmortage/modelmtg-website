'use client'

import { Card, Icon } from '@/components/design-system'
import { FaStar, FaCheckCircle, FaBalanceScale, FaUniversity, FaLock } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './TrustStackWall.module.css'

const testimonials = [
    {
        name: 'Sarah & Michael Chen',
        location: 'Houston Heights',
        text: 'Matthew helped us navigate a complex jumbo loan with ease. His expertise and attention to detail made our dream home purchase seamless.',
        rating: 5
    },
    {
        name: 'David Rodriguez',
        location: 'Katy, TX',
        text: 'Best mortgage experience I\'ve ever had. Fast, professional, and Matthew saved us $40K over the life of our loan.',
        rating: 5
    },
    {
        name: 'Jennifer Williams',
        location: 'Sugar Land',
        text: 'As a first-time buyer, I was nervous. Matthew explained everything clearly and got us an incredible rate. Highly recommend!',
        rating: 5
    }
]

export default function TrustStackWall() {
    const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({ threshold: 0.3 })
    const { ref: gridRef, isVisible: gridVisible } = useIntersectionAnimation({ threshold: 0.1 })
    const { ref: badgesRef, isVisible: badgesVisible } = useIntersectionAnimation({ threshold: 0.3 })

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div 
                    ref={headerRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.header} ${headerVisible ? styles.visible : ''}`}
                >
                    <h2>Trusted by Thousands of Houston Families</h2>
                    <div className={styles.overallRating}>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <Icon key={i} icon={FaStar} size="md" color="#D4AF37" />
                            ))}
                        </div>
                        <p className={styles.ratingText}>5.0 Overall Rating · 1,000+ Reviews</p>
                    </div>
                </div>

                <div 
                    ref={gridRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.testimonialsGrid} ${gridVisible ? styles.visible : ''}`}
                >
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} variant="elevated" padding="lg" className={styles.testimonialCard}>
                            <div className={styles.cardStars}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} icon={FaStar} size="sm" color="#D4AF37" />
                                ))}
                            </div>
                            <p className={styles.testimonialText}>
                                <span className={styles.quote}>"</span>
                                {testimonial.text}
                                <span className={styles.quote}>"</span>
                            </p>
                            <div className={styles.clientInfo}>
                                <div className={styles.clientAvatar}>
                                    {testimonial.name.split(' ')[0][0]}
                                    {testimonial.name.split(' ')[testimonial.name.split(' ').length - 1][0]}
                                </div>
                                <div className={styles.clientDetails}>
                                    <p className={styles.clientName}>{testimonial.name}</p>
                                    <p className={styles.clientLocation}>{testimonial.location}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div 
                    ref={badgesRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.badgesSection} ${badgesVisible ? styles.visible : ''}`}
                >
                    <h3 className={styles.badgesTitle}>Licensed & Certified</h3>
                    <div className={styles.badges}>
                        <div className={styles.badge}>
                            <Icon icon={FaCheckCircle} size="lg" color="#D4AF37" ariaLabel="NMLS Certified" />
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>NMLS Certified</p>
                                <p className={styles.badgeNumber}>#2518610</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <Icon icon={FaBalanceScale} size="lg" color="#D4AF37" ariaLabel="Equal Housing Opportunity" />
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>Equal Housing Opportunity</p>
                                <p className={styles.badgeNumber}>Accredited</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <Icon icon={FaUniversity} size="lg" color="#D4AF37" ariaLabel="Approved Lender" />
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>Approved Lender</p>
                                <p className={styles.badgeNumber}>All Major Banks</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <Icon icon={FaLock} size="lg" color="#D4AF37" ariaLabel="SSL Certified" />
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>SSL Certified</p>
                                <p className={styles.badgeNumber}>Secure Platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
