/**
 * Button Component
 * 
 * Consistent, accessible button component with multiple variants and sizes.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost)
 * - Size options (sm, md, lg)
 * - Icon support with positioning
 * - Loading state
 * - Minimum 44x44px touch target on mobile
 * - Keyboard accessible with visible focus indicators
 */

import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button content */
  children: React.ReactNode;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Accessible label (overrides children for screen readers) */
  ariaLabel?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Button component for consistent interactive elements
 * 
 * @example
 * // Primary button
 * <Button variant="primary" size="md">Click me</Button>
 * 
 * @example
 * // Button with icon
 * <Button variant="primary" icon={<FaArrowRight />} iconPosition="right">
 *   Continue
 * </Button>
 * 
 * @example
 * // Loading button
 * <Button variant="primary" loading>Processing...</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ariaLabel,
  className = '',
}) => {
  const variantClass = styles[`button-${variant}`];
  const sizeClass = styles[`button-${size}`];
  const fullWidthClass = fullWidth ? styles['button-full-width'] : '';
  const loadingClass = loading ? styles['button-loading'] : '';
  const iconLeftClass = icon && iconPosition === 'left' ? styles['icon-left'] : '';
  const iconRightClass = icon && iconPosition === 'right' ? styles['icon-right'] : '';

  const combinedClassName = `
    ${styles.button}
    ${variantClass}
    ${sizeClass}
    ${fullWidthClass}
    ${loadingClass}
    ${iconLeftClass}
    ${iconRightClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="32;0"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      {icon && iconPosition === 'left' && (
        <span className={styles['icon-wrapper']} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles['button-content']}>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className={styles['icon-wrapper']} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
