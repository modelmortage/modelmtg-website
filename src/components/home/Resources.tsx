import Link from 'next/link'
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
            title: 'First-Time Homebuyer Checklist (Houston)',
            excerpt: 'Essential steps and considerations for Houston first-time buyers.',
            href: '/blog/first-time-homebuyer-checklist-houston'
        },
        {
            title: 'Understanding Mortgage Pre-Approval',
            excerpt: 'What pre-approval means and how it strengthens your offer.',
            href: '/blog/understanding-mortgage-pre-approval'
        },
        {
            title: 'How Refinancing Works in Texas',
            excerpt: 'Overview of the refinance process and when it makes sense.',
            href: '/blog/how-refinancing-works-texas'
        }
    ]

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Resources</h2>
                    <p>Guides and insights to help you make confident mortgage decisions.</p>
                </div>

                <div className={styles.grid}>
                    {resources.map((resource, index) => (
                        <Link key={index} href={resource.href} className={styles.resourceLink}>
                            <Card className={styles.resourceCard}>
                                <h3>{resource.title}</h3>
                                <p>{resource.excerpt}</p>
                                <span className={styles.readMore}>Read more →</span>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/blog" className={styles.viewAllBtn}>
                        View All Resources
                    </Link>
                </div>
            </div>
        </section>
    )
}
