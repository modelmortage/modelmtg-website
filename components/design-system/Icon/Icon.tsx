/**
 * Icon Component
 * 
 * Wrapper component for React Icons that provides consistent sizing,
 * coloring, and accessibility features.
 * 
 * Features:
 * - Consistent size variants (sm: 16px, md: 24px, lg: 32px, xl: 48px)
 * - Color inheritance from parent or custom color
 * - Accessibility support with aria-label
 * - Automatic aria-hidden for decorative icons
 */

import React from 'react';
import { IconType } from 'react-icons';
import styles from './Icon.module.css';

export interface IconProps {
  /** Icon component from react-icons */
  icon: IconType;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom color (defaults to currentColor) */
  color?: string;
  /** Accessible label for screen readers (required for functional icons) */
  ariaLabel?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Icon component for consistent icon rendering
 * 
 * @example
 * // Functional icon with aria-label
 * <Icon icon={FaHome} size="md" ariaLabel="Home" />
 * 
 * @example
 * // Decorative icon (no aria-label)
 * <Icon icon={FaStar} size="sm" />
 * 
 * @example
 * // Custom color
 * <Icon icon={FaCheck} size="lg" color="#10B981" ariaLabel="Success" />
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color,
  ariaLabel,
  className = '',
}) => {
  if (!IconComponent) {
    console.warn('Icon component not found');
    return null;
  }

  const sizeClass = styles[`icon-${size}`];
  const combinedClassName = `${styles.icon} ${sizeClass} ${className}`.trim();

  // If no aria-label is provided, the icon is decorative
  const isDecorative = !ariaLabel;

  return (
    <IconComponent
      className={combinedClassName}
      style={{ color: color || 'currentColor' }}
      aria-label={ariaLabel}
      aria-hidden={isDecorative}
      role={isDecorative ? 'presentation' : undefined}
    />
  );
};

export default Icon;
