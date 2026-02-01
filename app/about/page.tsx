import type { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { aboutUsContent } from '@/lib/content/aboutUs'
import styles from './about.module.css'

export const metadata: Metadata = {
    title: aboutUsContent.metadata.title,
    description: aboutUsContent.metadata.description,
    keywords: aboutUsContent.metadata.keywords.join(', '),
    openGraph: {
        title: aboutUsContent.metadata.title,
        description: aboutUsContent.metadata.description,
        type: 'website',
        images: aboutUsContent.metadata.ogImage ? [{ url: aboutUsContent.metadata.ogImage }] : undefined,
    },
    alternates: {
        canonical: aboutUsContent.metadata.canonical,
    },
}

export default function AboutPage() {
    return (
        <ContentPage
            title={aboutUsContent.hero.title}
            subtitle={aboutUsContent.hero.subtitle}
            cta={{
                title: 'Ready to Get Started?',
                description: 'Contact us today to discuss your mortgage needs and get personalized guidance.',
                buttonText: 'Schedule a Call',
                buttonHref: '/contact'
            }}
        >
            {/* Main Content */}
            <div className={styles.contentGrid}>
                <div className={styles.mainContent}>
                    <h2 className={styles.sectionHeading}>Our Mission</h2>
                    {aboutUsContent.sections.map((section, index) => (
                        <p key={index} className={styles.paragraph}>
                            {section.content}
                        </p>
                    ))}
                </div>

                {/* Stats Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.statsCard}>
                        <h3 className={styles.statsHeading}>By The Numbers</h3>
                        <div className={styles.statsList}>
                            {aboutUsContent.stats.map((stat, index) => (
                                <div key={index} className={styles.statItem}>
                                    <div className={styles.statNumber}>{stat.number}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <h2 className={styles.valuesSectionHeading}>What Sets Us Apart</h2>
                <div className={styles.valuesGrid}>
                    {aboutUsContent.values.map((value, index) => (
                        <div key={index} className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>{value.title}</h3>
                            <p className={styles.valueDescription}>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </ContentPage>
    )
}
