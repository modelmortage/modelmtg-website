import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/shared/ContentPage'
import InlineCta from '@/components/shared/InlineCta'
import { loanOptions } from '@/lib/content/loanOptions'
import Link from 'next/link'
import { Card, Icon, Button } from '@/components/design-system'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'
import styles from '@/app/loan-options/[slug]/LoanOptionPage.module.css'

interface LocationServicePageProps {
    params: Promise<{
        city: string
        service: string
    }>
}

// Helper to format city slugs (e.g., 'the-woodlands' -> 'The Woodlands')
function formatCityName(slug: string): string {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export async function generateMetadata({ params }: LocationServicePageProps): Promise<Metadata> {
    const { city, service } = await params
    const loanOption = loanOptions.find((option) => option.slug === service)
    const cityName = formatCityName(city)

    if (!loanOption) {
        return {
            title: 'Service Not Found',
        }
    }

    const title = `${loanOption.title} in ${cityName}, TX | Model Mortgage`
    const description = `Looking for ${loanOption.title.toLowerCase()} in ${cityName}, TX? Model Mortgage provides expert guidance and competitive rates for ${cityName} homebuyers and investors.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        alternates: {
            canonical: `https://modelmtg.com/locations/${city}/${service}`,
        },
    }
}

export default async function LocationServicePage({ params }: LocationServicePageProps) {
    const { city, service } = await params
    const loanOption = loanOptions.find((option) => option.slug === service)
    const cityName = formatCityName(city)

    if (!loanOption) {
        notFound()
    }

    return (
        <ContentPage
            title={`${loanOption.title} in ${cityName}, TX`}
            subtitle={`Expert guidance for your ${cityName} real estate goals. ${loanOption.shortDescription}`}
            heroBackground="var(--midnight-black)"
            breadcrumbs={[
                { label: 'Locations', href: '/locations' },
                { label: cityName, href: `/locations/${city}` },
                { label: loanOption.title, href: `/locations/${city}/${service}` },
            ]}
            heroCta={{
                text: `Get Pre-Approved in ${cityName}`,
                href: '/pre-qualify',
            }}
            cta={{
                title: `Ready to Explore ${loanOption.title} in ${cityName}?`,
                description: `Contact our local experts today to discuss your mortgage needs in ${cityName} and get personalized guidance.`,
                buttonText: 'Schedule a Call',
                buttonHref: '/schedule-a-call',
            }}
        >
            {/* Overview Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                <div className={styles.overview}>
                    <p className={styles.paragraph}>
                        Buying or refinancing a home in {cityName} requires a lender who understands both the local market and the intricacies of {loanOption.title.toLowerCase()}. At Model Mortgage, we specialize in helping {cityName} residents navigate these specific loan requirements to secure the best possible terms.
                    </p>
                    {loanOption.fullDescription.split('\n\n').slice(0, 2).map((paragraph, index) => (
                        <p key={`desc-${index}`} className={styles.paragraph}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* Mid-page Inline CTA */}
            <InlineCta
                title={`Discover Your ${cityName} Buying Power`}
                description={`Our team can help you navigate ${loanOption.title} requirements in the ${cityName} market.`}
                buttonText="Get Pre-Approved"
                buttonHref="/pre-qualify"
            />

            {/* Benefits Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Key Benefits for {cityName} Buyers</h2>
                <ul className={styles.list}>
                    {loanOption.benefits.map((benefit, index) => (
                        <li key={index} className={styles.listItem}>
                            <Icon
                                icon={FaCheckCircle}
                                size="md"
                                className={styles.checkIcon}
                            />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Requirements Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Requirements</h2>
                <ul className={styles.list}>
                    {loanOption.requirements.map((requirement, index) => (
                        <li key={index} className={styles.listItem}>
                            <Icon
                                icon={FaCircle}
                                size="sm"
                                className={styles.bulletIcon}
                            />
                            <span>{requirement}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Next Steps Section */}
            <section className={styles.section}>
                <Card variant="flat" padding="lg" className={styles.nextStepsCard}>
                    <h2 className={styles.sectionTitle}>Next Steps in {cityName}</h2>
                    <p className={styles.paragraph}>
                        Ready to move forward with a {loanOption.title} in {cityName}? Here's how to get started:
                    </p>
                    <ol className={styles.orderedList}>
                        <li className={styles.orderedListItem}>
                            <strong>Schedule a consultation</strong> with our local experts
                        </li>
                        <li className={styles.orderedListItem}>
                            <strong>Get pre-approved</strong> to understand your buying power
                        </li>
                        <li className={styles.orderedListItem}>
                            <strong>Find your home</strong> in {cityName} with confidence
                        </li>
                        <li className={styles.orderedListItem}>
                            <strong>Close on your loan</strong> with expert guidance
                        </li>
                    </ol>
                    <div className={styles.ctaButtons}>
                        <Link href="/schedule-a-call" style={{ textDecoration: 'none' }}>
                            <Button variant="primary" size="lg" fullWidth>
                                Schedule a Call
                            </Button>
                        </Link>
                    </div>
                </Card>
            </section>
        </ContentPage>
    )
}
