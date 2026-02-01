/**
 * Card Component
 * 
 * Consistent container component for grouping related content.
 * 
 * Features:
 * - Multiple variants (elevated, outlined, flat)
 * - Padding size options (sm, md, lg)
 * - Hoverable state with lift animation
 * - Clickable support
 */

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card variant */
  variant?: 'elevated' | 'outlined' | 'flat';
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
  /** Enable hover effect */
  hoverable?: boolean;
  /** Click handler (makes card clickable) */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * Card component for consistent content containers
 * 
 * @example
 * // Elevated card with medium padding
 * <Card variant="elevated" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * @example
 * // Hoverable clickable card
 * <Card variant="outlined" hoverable onClick={() => console.log('clicked')}>
 *   <p>Click me!</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
}) => {
  const variantClass = styles[`card-${variant}`];
  const paddingClass = styles[`card-padding-${padding}`];
  const hoverableClass = hoverable ? styles['card-hoverable'] : '';
  const clickableClass = onClick ? styles['card-clickable'] : '';

  const combinedClassName = `
    ${styles.card}
    ${variantClass}
    ${paddingClass}
    ${hoverableClass}
    ${clickableClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // If clickable, make it keyboard accessible
  const interactiveProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      }
    : {};

  return (
    <div className={combinedClassName} {...interactiveProps}>
      {children}
    </div>
  );
};

export default Card;
