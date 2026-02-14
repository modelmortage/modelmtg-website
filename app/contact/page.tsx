import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './contact.module.css'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
    title: 'Contact Us | Model Mortgage Houston',
    description: 'Connect with our senior advisory team to discuss your mortgage needs. Call (832) 727-4128 or email matthew@modelmtg.com.',
    keywords: 'contact Model Mortgage, Houston mortgage broker contact, mortgage consultation',
    openGraph: {
        title: 'Contact Us | Model Mortgage Houston',
        description: 'Connect with our senior advisory team to discuss your mortgage needs.',
        type: 'website',
    },
    alternates: {
        canonical: '/contact',
    },
}

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.dustBg}></div>
                <div className={styles.gradientOverlay}></div>

                <div className={styles.container}>
                    <div className={styles.headerSection}>
                        <h1 className={styles.title}>
                            Begin the <br />
                            <span className={styles.titleAccent}>Conversation</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Strategic mortgage guidance for Houston buyers, homeowners, and investors.
                        </p>
                    </div>

                    <div className={styles.contentGrid}>
                        {/* Contact Information */}
                        <div className={styles.contactInfo}>
                            <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>Private Client Briefing</span>

                                <div className={styles.infoItems}>
                                    <div className={styles.infoItem}>
                                        <label className={styles.itemLabel}>Direct Advisory Line</label>
                                        <a href="tel:+18327274128" className={styles.itemValue}>
                                            (832) 727-4128
                                        </a>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <label className={styles.itemLabel}>Correspondence</label>
                                        <a href="mailto:matthew@modelmtg.com" className={styles.itemValue}>
                                            matthew@modelmtg.com
                                        </a>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <label className={styles.itemLabel}>Houston Headquarters</label>
                                        <address className={styles.address}>
                                            18 Augusta Pines Dr #203<br />
                                            Spring, Texas 77389
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formSection}>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
