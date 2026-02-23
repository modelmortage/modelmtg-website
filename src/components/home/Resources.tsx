'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/src/components/ui/Card'
import styles from './Resources.module.css'

/**
 * Resources Section - SEO Booster
 * 
 * Shows 3 featured posts to signal education
 */
export function Resources() {
    const resources = [
        {
            title: 'Down Payment Options and Strategies for Homebuyers',
            excerpt: 'Explore down payment requirements for different loan types and discover strategies to save faster.',
            href: '/blog/down-payment-options-and-strategies',
            image: '/down-payment-options-and-strategies-for-homebuyers.png'
        },
        {
            title: 'A Step-by-Step Guide to Shopping for a New Home',
            excerpt: 'Navigate the home buying process with confidence. Learn the essential steps from getting pre-approved to closing on your dream home.',
            href: '/blog/step-by-step-guide-shopping-new-home',
            image: '/images/blog/step_by_step_home_shopping.png'
        },
        {
            title: 'The Complete Guide to VA Loans for Veterans and Military',
            excerpt: 'Discover the powerful benefits of VA loans including zero down payment, no PMI, and competitive rates.',
            href: '/blog/complete-guide-to-va-loans',
            image: '/images/blog/complete_guide_va_loans.png'
        }
    ]

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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Resources</h2>
                    <p>Guides and insights to help you make confident mortgage decisions.</p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    {resources.map((resource, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            <Link href={resource.href} className={styles.resourceLink}>
                                <motion.div
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                >
                                    <Card className={styles.resourceCard}>
                                        <div className={styles.imageContainer}>
                                            <Image
                                                src={resource.image}
                                                alt={resource.title}
                                                width={400}
                                                height={250}
                                                className={styles.resourceImage}
                                            />
                                        </div>
                                        <div className={styles.cardContent}>
                                            <h3>{resource.title}</h3>
                                            <p>{resource.excerpt}</p>
                                            <span className={styles.readMore}>Read more →</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.ctaContainer}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link href="/blog" className={styles.viewAllBtn}>
                        View All Resources
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
