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
    FaLock,
    FaCheckCircle
} from 'react-icons/fa'
import { Icon } from './design-system/Icon/Icon'
import { siteData } from '@/src/lib/siteData'
import styles from './Footer.module.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <Image
                        src="/model-mortage-logo.png"
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
                    {/* Column 1: Company & Resources */}
                    <div className={styles.linkColumn}>
                        <h3>Company</h3>
                        <Link href="/about-us">About Model Mortgage</Link>
                        <Link href="/meet-our-team">Meet The Team</Link>
                        <Link href="/reviews">Client Reviews</Link>
                        <Link href="/contact">Contact Us</Link>

                        <h3 style={{ marginTop: '1.5rem' }}>Resources</h3>
                        <Link href="/blog">
                            <Icon icon={FaGraduationCap} size="sm" ariaLabel="" />
                            <span>Mortgage Blog</span>
                        </Link>
                        <Link href="/learning-center">
                            <Icon icon={FaFileAlt} size="sm" ariaLabel="" />
                            <span>Learning Center</span>
                        </Link>
                        <a href="https://2516810.my1003app.com/?time=1702581789975" target="_blank" rel="noopener noreferrer">
                            <Icon icon={FaCheckCircle} size="sm" ariaLabel="" />
                            <span>Pre-Qualify Now</span>
                        </a>
                    </div>

                    {/* Column 2: Loan Options */}
                    <div className={styles.linkColumn}>
                        <h3>Loan Options</h3>
                        <Link href="/loan-options">All Loan Programs</Link>
                        <Link href="/loan-options/conventional">Conventional Loans</Link>
                        <Link href="/loan-options/fha">FHA Loans</Link>
                        <Link href="/loan-options/va">VA Loans</Link>
                        <Link href="/loan-options/jumbo">Jumbo Loans</Link>
                        <Link href="/loan-options/investment">Investment Property</Link>
                    </div>

                    {/* Column 3: Calculators */}
                    <div className={styles.linkColumn}>
                        <h3>Calculators</h3>
                        <Link href="/calculator/purchase">Purchase Calculator</Link>
                        <Link href="/calculator/refinance">Refinance Calculator</Link>
                        <Link href="/calculator/affordability">Affordability</Link>
                        <Link href="/calculator/va-purchase">VA Purchase</Link>
                        <Link href="/calculator/va-refinance">VA Refinance</Link>
                        <Link href="/calculator/rent-vs-buy">Rent vs. Buy</Link>
                        <Link href="/calculator/dscr">DSCR Calculator</Link>
                        <Link href="/calculator/fix-flip">Fix & Flip</Link>
                    </div>

                    {/* Column 4: Connect */}
                    <div className={styles.linkColumn}>
                        <h3>Connect With Us</h3>
                        <a href="tel:+18327274128" className={styles.contactLink}>
                            <Icon icon={FaPhone} size="sm" ariaLabel="Phone" />
                            <span>(832) 727-4128</span>
                        </a>
                        <a href="mailto:matthew@modelmtg.com" className={styles.contactLink}>
                            <Icon icon={FaEnvelope} size="sm" ariaLabel="Email" />
                            <span>matthew@modelmtg.com</span>
                        </a>
                        <p className={styles.address}>
                            18 Augusta Pines Dr #203<br />
                            Spring, TX 77389
                        </p>
                        <div className={styles.socialIcons}>
                            <a
                                href={siteData.social.facebook}
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
                        <a href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2516810" target="_blank" rel="noopener noreferrer">NMLS Consumer Access</a>
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
                            <span>NMLS #2516810</span>
                        </div>
                        <span className={styles.complianceDivider}>/</span>
                        <div className={styles.complianceItem}>
                            <span>Licensed in Texas</span>
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
