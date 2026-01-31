'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-v3.png"
                        alt="Model Mortgage - Houston Mortgage Broker"
                        width={180}
                        height={60}
                        priority
                        className={styles.logoImage}
                    />
                    <h1 className={styles.logoText}>MODEL MORTGAGE</h1>
                </Link>

                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                    <Link href="/learn" className={styles.navLink}>Learn</Link>
                    <Link href="/pre-qualify" className={styles.navLink}>Pre-Qualify</Link>
                    <Link href="/calculator" className={styles.navLink}>Calculator</Link>
                    <Link href="/loan-options" className={styles.navLink}>Loan Options</Link>
                    <Link href="/about" className={styles.navLink}>About Us</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                    <Link href="/apply" className={`${styles.navLink} ${styles.ctaButton}`}>
                        Apply Online
                    </Link>
                </nav>

                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    )
}
