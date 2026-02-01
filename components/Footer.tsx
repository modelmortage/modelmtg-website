import Link from 'next/link'
import Image from 'next/image'
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
                        width={200}
                        height={67}
                        className={styles.footerLogo}
                    />
                    <p className={styles.tagline}>Strategic Mortgage Planning</p>
                </div>

                <div className={styles.divider}></div>

                {/* Links Grid */}
                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h3>About Us</h3>
                        <Link href="/about">Our Story</Link>
                        <Link href="/team">Meet Our Team</Link>
                        <Link href="/reviews">Client Reviews</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Loan Options</h3>
                        <Link href="/loan-options/conventional">Conventional Loans</Link>
                        <Link href="/loan-options/fha">FHA Loans</Link>
                        <Link href="/loan-options/va">VA Loans</Link>
                        <Link href="/loan-options/jumbo">Jumbo Loans</Link>
                        <Link href="/loan-options/refinance">Refinance</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Resources</h3>
                        <Link href="/learn">Learning Center</Link>
                        <Link href="/calculator">Mortgage Calculator</Link>
                        <Link href="/pre-qualify">Pre-Qualification</Link>
                        <Link href="/blog">Blog</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h3>Connect With Us</h3>
                        <a href="tel:832-727-4128">(832) 727-4128</a>
                        <a href="mailto:info@modelmortgage.com">Email Us Today</a>
                        <div className={styles.socialIcons}>
                            <a href="#" aria-label="Facebook" className={styles.socialIcon}>f</a>
                            <a href="#" aria-label="Instagram" className={styles.socialIcon}>i</a>
                            <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>in</a>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/nmls">NMLS Consumer Access</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/ada-accessibility-statement">ADA Accessibility</Link>
                    </div>

                    <div className={styles.certifications}>
                        <div className={styles.cert}>
                            <p>Equal Housing Opportunity</p>
                        </div>
                        <div className={styles.cert}>
                            <p>NMLS #2518610</p>
                        </div>
                        <div className={styles.cert}>
                            <p>SSL Certified</p>
                        </div>
                    </div>

                    <p className={styles.copyright}>
                        © {currentYear} Model Mortgage. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
