import styles from './Card.module.css'

interface CardProps {
    children: React.ReactNode
    className?: string
}

/**
 * Simple Card Component - Private Client Style
 * 
 * White background with light border for institutional feel
 */
export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`${styles.card} ${className}`}>
            {children}
        </div>
    )
}
