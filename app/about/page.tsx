import type { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import { aboutUsContent } from '@/lib/content/aboutUs'
import { Card } from '@/components/design-system/Card'
import { Icon } from '@/components/design-system/Icon'
import { getIcon } from '@/lib/utils/iconMap'
import { FaStar } from 'react-icons/fa'
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
                    <Card variant="elevated" padding="lg">
                        <h3 className={styles.statsHeading}>By The Numbers</h3>
                        <div className={styles.statsList}>
                            {aboutUsContent.stats.map((stat, index) => (
                                <div key={index} className={styles.statItem}>
                                    <div className={styles.statNumber}>
                                        {stat.number}
                                        {stat.showStars && (
                                            <span className={styles.stars}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon key={i} icon={FaStar} size="sm" />
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </aside>
            </div>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <h2 className={styles.valuesSectionHeading}>What Sets Us Apart</h2>
                <div className={styles.valuesGrid}>
                    {aboutUsContent.values.map((value, index) => {
                        const IconComponent = getIcon(value.iconName);
                        return (
                            <Card key={index} variant="outlined" padding="lg" hoverable>
                                <div className={styles.valueCard}>
                                    {IconComponent && (
                                        <div className={styles.valueIcon}>
                                            <Icon icon={IconComponent} size="xl" />
                                        </div>
                                    )}
                                    <h3 className={styles.valueTitle}>{value.title}</h3>
                                    <p className={styles.valueDescription}>{value.description}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </ContentPage>
    )
}
