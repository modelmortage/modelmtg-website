import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './contact.module.css'
import ContactForm from './ContactForm'
import ContactTitle from './ContactTitle'

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
                <div className={styles.container}>
                    <div className={styles.headerSection}>
                        <ContactTitle />
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
                                            5251 Westheimer Rd #830<br />
                                            Houston, TX 77056
                                        </address>
                                        <div className={styles.mapWrapper}>
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.306904989146!2d-95.467524!3d29.739829800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c165fe3d21d9%3A0xd9e4c8f2f6b7720c!2s5251%20Westheimer%20Rd%20%23830%2C%20Houston%2C%20TX%2077056!5e0!3m2!1sen!2sus!4v1773933627411!5m2!1sen!2sus"
                                                className={styles.map}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="Model Mortgage location in Houston, Texas"
                                            />
                                        </div>
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
