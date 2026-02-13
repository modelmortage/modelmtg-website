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
            title: 'First-Time Homebuyer Checklist',
            excerpt: 'Essential steps and considerations for Houston first-time buyers.',
            href: '/blog/first-time-homebuyer-checklist-houston',
            image: '/first-time-homebuyer-houston.png'
        },
        {
            title: 'Understanding Mortgage Pre-Approval',
            excerpt: 'What pre-approval means and how it strengthens your offer.',
            href: '/blog/understanding-mortgage-pre-approval',
            image: '/mortage-pre-approval.png'
        },
        {
            title: 'How Refinancing Works in Texas',
            excerpt: 'Overview of the refinance process and when it makes sense.',
            href: '/blog/how-refinancing-works-in-texas',
            image: '/refinancing-houston-texas.png'
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
