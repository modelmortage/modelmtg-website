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
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Trusted by Thousands of Houston Families</h2>
                    <div className={styles.overallRating}>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={styles.star}>★</span>
                            ))}
                        </div>
                        <p className={styles.ratingText}>5.0 Overall Rating · 1,000+ Reviews</p>
                    </div>
                </div>

                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.cardStars}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={styles.cardStar}>★</span>
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
                        </div>
                    ))}
                </div>

                <div className={styles.badgesSection}>
                    <h3 className={styles.badgesTitle}>Licensed & Certified</h3>
                    <div className={styles.badges}>
                        <div className={styles.badge}>
                            <span className={styles.badgeIcon}>✓</span>
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>NMLS Certified</p>
                                <p className={styles.badgeNumber}>#2518610</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <span className={styles.badgeIcon}>⚖️</span>
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>Equal Housing Opportunity</p>
                                <p className={styles.badgeNumber}>Accredited</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <span className={styles.badgeIcon}>🏦</span>
                            <div className={styles.badgeInfo}>
                                <p className={styles.badgeName}>Approved Lender</p>
                                <p className={styles.badgeNumber}>All Major Banks</p>
                            </div>
                        </div>
                        <div className={styles.badge}>
                            <span className={styles.badgeIcon}>🔒</span>
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
