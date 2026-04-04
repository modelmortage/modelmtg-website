'use client'

import Link from 'next/link'
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

    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
    const [calculatorDropdownOpen, setCalculatorDropdownOpen] = useState(false)
    const [loanOptionsDropdownOpen, setLoanOptionsDropdownOpen] = useState(false)
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

    // Handle scroll behavior for styling
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            // Set scrolled state for styling
            setIsScrolled(currentScrollY > 10)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
            className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''} ${mobileMenuOpen ? styles.headerMobileOpen : ''}`}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={handleLinkClick}>
                    <img
                        src="/model-mortage-logo.png"
                        alt="Model Mortgage - Houston Mortgage Broker"
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
                    {/* Loan Options Dropdown */}
                    <div className={styles.navDropdown}>
                        <Link
                            href="/loan-options"
                            className={`${styles.navLink} ${styles.dropdownToggle} ${isActive('/loan-options') ? styles.active : ''}`}
                            onClick={(e) => {
                                if (window.innerWidth <= 768) {
                                    e.preventDefault()
                                    setLoanOptionsDropdownOpen(!loanOptionsDropdownOpen)
                                } else {
                                    handleLinkClick()
                                }
                            }}
                            aria-expanded={loanOptionsDropdownOpen}
                        >
                            Loan Options
                            <FaChevronDown className={`${styles.chevron} ${loanOptionsDropdownOpen ? styles.chevronOpen : ''}`} />
                        </Link>
                        <div className={`${styles.dropdownMenu} ${styles.dropdownMenuWide} ${loanOptionsDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                            <div className={styles.loanColumns}>
                                <div className={styles.loanColumn}>
                                    <span className={styles.loanColumnHeading}>Purchase</span>
                                    <Link href="/loan-options/fixed-rate-mortgage" className={styles.dropdownItem} onClick={handleLinkClick}>Fixed Rate Mortgage</Link>
                                    <Link href="/loan-options/fha-home-loan" className={styles.dropdownItem} onClick={handleLinkClick}>FHA Loan</Link>
                                    <Link href="/loan-options/va-home-loan" className={styles.dropdownItem} onClick={handleLinkClick}>VA Loan</Link>
                                    <Link href="/loan-options/usda-loan" className={styles.dropdownItem} onClick={handleLinkClick}>USDA Loan</Link>
                                    <Link href="/loan-options/jumbo-home-loan" className={styles.dropdownItem} onClick={handleLinkClick}>Jumbo Loan</Link>
                                    <Link href="/loan-options/first-time-home-buyer" className={styles.dropdownItem} onClick={handleLinkClick}>First-Time Home Buyer</Link>
                                    <Link href="/loan-options/low-down-payment-purchase-options" className={styles.dropdownItem} onClick={handleLinkClick}>Low Down Payment Options</Link>
                                    <Link href="/loan-options/investment-property-loans" className={styles.dropdownItem} onClick={handleLinkClick}>Investment Property</Link>
                                </div>
                                <div className={styles.loanColumnDivider} />
                                <div className={styles.loanColumn}>
                                    <span className={styles.loanColumnHeading}>Refinance</span>
                                    <Link href="/loan-options/rate-term-refinance" className={styles.dropdownItem} onClick={handleLinkClick}>Rate & Term Refinance</Link>
                                    <Link href="/loan-options/cash-out-refinance" className={styles.dropdownItem} onClick={handleLinkClick}>Cash-Out Refinance</Link>
                                    <Link href="/loan-options/va-irrrl" className={styles.dropdownItem} onClick={handleLinkClick}>VA Refinance (IRRRL / Cash-Out)</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Calculator Dropdown */}
                    <div className={styles.navDropdown}>
                        <Link
                            href="/calculator"
                            className={`${styles.navLink} ${styles.dropdownToggle} ${isActive('/calculator') ? styles.active : ''}`}
                            onClick={(e) => {
                                if (window.innerWidth <= 768) {
                                    e.preventDefault()
                                    setCalculatorDropdownOpen(!calculatorDropdownOpen)
                                } else {
                                    handleLinkClick()
                                }
                            }}
                            aria-expanded={calculatorDropdownOpen}
                        >
                            Calculators
                            <FaChevronDown className={`${styles.chevron} ${calculatorDropdownOpen ? styles.chevronOpen : ''}`} />
                        </Link>
                        <div className={`${styles.dropdownMenu} ${calculatorDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                            <Link
                                href="/calculator/purchase"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Purchase Calculator
                            </Link>
                            <Link
                                href="/calculator/affordability"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                How Much Can I Afford?
                            </Link>
                            <Link
                                href="/calculator/refinance"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Refinance Calculator
                            </Link>
                            <Link
                                href="/calculator/rent-vs-buy"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Rent vs Buy
                            </Link>
                            <Link
                                href="/calculator/va-purchase"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                VA Purchase Calculator
                            </Link>
                            <Link
                                href="/calculator/va-refinance"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                VA Refinance Calculator
                            </Link>
                            <Link
                                href="/calculator/dscr"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                DSCR Investment Calculator
                            </Link>
                            <Link
                                href="/calculator/fix-flip"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Fix & Flip Calculator
                            </Link>
                        </div>
                    </div>
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
                                href="/about-us"
                                className={styles.dropdownItem}
                                onClick={handleLinkClick}
                            >
                                Our Story
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
