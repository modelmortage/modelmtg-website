import Link from 'next/link'
import Image from 'next/image'
import {
    FaPhone,
    FaEnvelope,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaHome,
    FaFileAlt,
    FaGraduationCap,
    FaCalculator,
    FaShieldAlt,
    FaCertificate,
    FaLock
} from 'react-icons/fa'
import { Icon } from './design-system/Icon/Icon'
import styles from './Footer.module.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <Image
                        src="/logo-v3.png"
                        alt="Model Mortgage - Houston Mortgage Broker"
                        width={50}
                        height={17}
                        loading="lazy"
                        className={styles.footerLogo}
                    />
                    <p className={styles.tagline}>Model Mortgage</p>
                </div>

                <div className={styles.divider}></div>

                {/* Links Grid - Four Column Layout */}
                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h3>About Us</h3>
                        <Link href="/about-us">Our Story</Link>
                        <Link href="/team">Meet Our Team</Link>
                        <Link href="/reviews">Client Reviews</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Loan Options</h3>
                        <Link href="/loan-options/conventional">Conventional Loans</Link>
                        <Link href="/loan-options/fha-home-loan">FHA Loans</Link>
                        <Link href="/loan-options/va">VA Loans</Link>
                        <Link href="/loan-options/jumbo">Jumbo Loans</Link>
                        <Link href="/loan-options/refinance">Refinance</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Resources</h3>
                        <Link href="/learn">
                            <Icon icon={FaGraduationCap} size="sm" ariaLabel="" />
                            <span>Learning Center</span>
                        </Link>
                        <Link href="/calculator">
                            <Icon icon={FaCalculator} size="sm" ariaLabel="" />
                            <span>Mortgage Calculator</span>
                        </Link>
                        <a href="https://2516810.my1003app.com/?time=1702581789975" target="_blank" rel="noopener noreferrer">
                            <Icon icon={FaFileAlt} size="sm" ariaLabel="" />
                            <span>Pre-Qualification</span>
                        </a>
                        <Link href="/blog">Blog</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Connect With Us</h3>
                        <a href="tel:832-727-4128" className={styles.contactLink}>
                            <Icon icon={FaPhone} size="sm" ariaLabel="Phone" />
                            <span>(832) 727-4128</span>
                        </a>
                        <a href="mailto:info@modelmortgage.com" className={styles.contactLink}>
                            <Icon icon={FaEnvelope} size="sm" ariaLabel="Email" />
                            <span>info@modelmortgage.com</span>
                        </a>
                        <div className={styles.socialIcons}>
                            <a
                                href="https://www.facebook.com/modelmortgage"
                                aria-label="Follow us on Facebook"
                                className={styles.socialIcon}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon icon={FaFacebook} size="md" ariaLabel="" />
                            </a>
                            <a
                                href="https://www.instagram.com/modelmortgage"
                                aria-label="Follow us on Instagram"
                                className={styles.socialIcon}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon icon={FaInstagram} size="md" ariaLabel="" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/modelmortgage"
                                aria-label="Connect with us on LinkedIn"
                                className={styles.socialIcon}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon icon={FaLinkedin} size="md" ariaLabel="" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    {/* American-Owned Business Badge - Bottom Left */}
                    <div className={styles.badgeContainer}>
                        <Image
                            src="/american-owned-business.png"
                            alt="American-owned business"
                            width={150}
                            height={150}
                            loading="lazy"
                            className={styles.businessBadge}
                        />
                    </div>



                    <div className={styles.legalLinks}>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/nmls">NMLS Consumer Access</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/ada-accessibility-statement">ADA Accessibility</Link>
                    </div>

                    <div className={styles.complianceStrip}>
                        <div className={styles.complianceItem}>
                            <Icon icon={FaHome} size="sm" ariaLabel="" />
                            <span>Equal Housing Opportunity</span>
                        </div>
                        <span className={styles.complianceDivider}>/</span>
                        <div className={styles.complianceItem}>
                            <Icon icon={FaCertificate} size="sm" ariaLabel="" />
                            <span>NMLS #2518610</span>
                        </div>
                        <span className={styles.complianceDivider}>/</span>
                        <div className={styles.complianceItem}>
                            <span>1177 West Loop South, Suite 1700, Houston, TX 77027</span>
                        </div>
                    </div>

                    <p className={styles.copyright}>
                        © {currentYear} Model Mortgage. All rights reserved. Rates subject to change.
                    </p>
                </div>
            </div>
        </footer>
    )
}
