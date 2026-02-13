import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps {
    href: string
    children: React.ReactNode
    variant?: 'primary' | 'secondary'
    className?: string
}

/**
 * Reusable Button Component - Private Client Style
 * 
 * Variants:
 * - primary: Gold background for main CTAs
 * - secondary: White background with gray border
 */
export function Button({
    href,
    children,
    variant = 'primary',
    className = ''
}: ButtonProps) {
    const variantClass = variant === 'primary' ? styles.primary : styles.secondary

    return (
        <Link
            href={href}
            className={`${styles.button} ${variantClass} ${className}`}
        >
            {children}
        </Link>
    )
}
