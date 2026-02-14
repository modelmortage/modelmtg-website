'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
    FaHome,
    FaGraduationCap,
    FaCalculator,
    FaFileAlt,
    FaUsers,
    FaBlog,
    FaPhone,
    FaBars,
    FaTimes,
    FaChevronDown
} from 'react-icons/fa'
import { Button } from './design-system/Button/Button'
import { Icon } from './design-system/Icon/Icon'
import styles from './Header.module.css'
import { siteData } from '@/src/lib/siteData'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [showHeader, setShowHeader] = useState(true)
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
    const pathname = usePathname()
    const headerRef = useRef<HTMLElement>(null)

    // Helper function to check if a nav item is active
    const isActive = (path: string) => {
        if (!pathname) return false
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    // Handle scroll behavior for show/hide header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Set scrolled state for styling
            setIsScrolled(currentScrollY > 10)

            // Show/hide header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setShowHeader(false)
            } else {
                // Scrolling up
                setShowHeader(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

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

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [mobileMenuOpen])

    const handleLinkClick = () => {
        setMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    return (
        <header
            ref={headerRef}
            className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''} ${showHeader ? styles.headerVisible : styles.headerHidden} ${mobileMenuOpen ? styles.headerMobileOpen : ''}`}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={handleLinkClick}>
                    <Image
                        src="/model-mortage-logo.png"
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
                        href="/"
                        className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                        aria-current={isActive('/') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Home
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
                        href="/calculator"
                        className={`${styles.navLink} ${isActive('/calculator') ? styles.active : ''}`}
                        aria-current={isActive('/calculator') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Calculator
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
                        href="/blog"
                        className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
                        aria-current={isActive('/blog') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Blog
                    </Link>
                    
                    {/* About Dropdown */}
                    <div className={styles.navDropdown}>
                        <Link
                            href="/about-us"
                            className={`${styles.navLink} ${styles.dropdownToggle} ${isActive('/about-us') || isActive('/meet-our-team') || isActive('/reviews') ? styles.active : ''}`}
                            onClick={(e) => {
                                // On mobile, toggle dropdown instead of navigating
                                if (window.innerWidth <= 768) {
                                    e.preventDefault()
                                    setAboutDropdownOpen(!aboutDropdownOpen)
                                } else {
                                    handleLinkClick()
                                }
                            }}
                            aria-expanded={aboutDropdownOpen}
                        >
                            About Us
                            <FaChevronDown className={`${styles.chevron} ${aboutDropdownOpen ? styles.chevronOpen : ''}`} />
                        </Link>
                        <div className={`${styles.dropdownMenu} ${aboutDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                            <Link
                                href="/about-us"
                                className={`${styles.dropdownItem} ${styles.dropdownItemDesktopOnly}`}
                                onClick={handleLinkClick}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/meet-our-team"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Meet the Team
                            </Link>
                            <Link
                                href="/reviews"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Reviews
                            </Link>
                        </div>
                    </div>
                    
                    <Link
                        href="/contact"
                        className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
                        aria-current={isActive('/contact') ? 'page' : undefined}
                        onClick={handleLinkClick}
                    >
                        Contact
                    </Link>

                    <div className={styles.ctaButtons}>
                        <a
                            href={siteData.cta.applyOnline.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaLink}
                            onClick={handleLinkClick}
                        >
                            <Button variant="primary" size="sm">
                                Apply Online
                            </Button>
                        </a>
                    </div>
                </nav>

                <button
                    className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleOpen : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="main-navigation"
                >
                    {mobileMenuOpen ? (
                        <Icon icon={FaTimes} size="md" ariaLabel="" />
                    ) : (
                        <Icon icon={FaBars} size="md" ariaLabel="" />
                    )}
                </button>
            </div>
        </header>
    )
}
