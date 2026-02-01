'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Helper function to check if a nav item is active
    const isActive = (path: string) => {
        if (!pathname) return false
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (mobileMenuOpen && !target.closest(`.${styles.nav}`) && !target.closest(`.${styles.mobileToggle}`)) {
                setMobileMenuOpen(false)
            }
        }

        if (mobileMenuOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [mobileMenuOpen])

    const handleLinkClick = () => {
        setMobileMenuOpen(false)
    }

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
                    <span className={styles.logoText}>MODEL MORTGAGE</span>
                </Link>

                <nav 
                    id="main-navigation"
                    className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}
                    aria-label="Main navigation"
                >
                    <Link 
                        href="/learn" 
                        className={`${styles.navLink} ${isActive('/learn') ? styles.active : ''}`}
                        aria-current={isActive('/learn') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Learn
                    </Link>
                    <Link 
                        href="/pre-qualify" 
                        className={`${styles.navLink} ${isActive('/pre-qualify') ? styles.active : ''}`}
                        aria-current={isActive('/pre-qualify') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Pre-Qualify
                    </Link>
                    <Link 
                        href="/calculator" 
                        className={`${styles.navLink} ${isActive('/calculator') ? styles.active : ''}`}
                        aria-current={isActive('/calculator') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Calculator
                    </Link>
                    <Link 
                        href="/loan-options" 
                        className={`${styles.navLink} ${isActive('/loan-options') ? styles.active : ''}`}
                        aria-current={isActive('/loan-options') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Loan Options
                    </Link>
                    <Link 
                        href="/about" 
                        className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                        aria-current={isActive('/about') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        About Us
                    </Link>
                    <Link 
                        href="/blog" 
                        className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
                        aria-current={isActive('/blog') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Blog
                    </Link>
                    <Link 
                        href="/contact" 
                        className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
                        aria-current={isActive('/contact') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Contact
                    </Link>
                    <Link 
                        href="/apply" 
                        className={`${styles.navLink} ${styles.ctaButton}`}
                        onClick={handleLinkClick}
                    >
                        Apply Online
                    </Link>
                </nav>

                <button
                    className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleOpen : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="main-navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    )
}
