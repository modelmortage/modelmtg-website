'use client'

/**
 * Input Component
 * 
 * Consistent form input component with validation and accessibility features.
 * 
 * Features:
 * - Multiple input types (text, email, number, tel, password)
 * - Floating label behavior
 * - Error state with error message
 * - Helper text support
 * - Icon support
 * - Keyboard accessible
 */

import React, { useState } from 'react';
import styles from './Input.module.css';

export interface InputProps {
  /** Input type */
  type?: 'text' | 'email' | 'number' | 'tel' | 'password';
  /** Input label */
  label: string;
  /** Input value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width input */
  fullWidth?: boolean;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Input component for consistent form inputs
 * 
 * @example
 * // Basic input
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 * />
 * 
 * @example
 * // Input with error
 * <Input
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={setPassword}
 *   error="Password must be at least 8 characters"
 * />
 * 
 * @example
 * // Input with icon
 * <Input
 *   label="Search"
 *   value={search}
 *   onChange={setSearch}
 *   icon={<FaSearch />}
 * />
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  required = false,
  disabled = false,
  fullWidth = false,
  name,
  id,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  
  const wrapperClass = `
    ${styles['input-wrapper']}
    ${fullWidth ? styles['input-full-width'] : ''}
    ${error ? styles['input-error'] : ''}
    ${disabled ? styles['input-disabled'] : ''}
    ${isFocused ? styles['input-focused'] : ''}
    ${icon ? styles['input-with-icon'] : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const labelClass = `
    ${styles.label}
    ${isFloating ? styles['label-floating'] : ''}
  `.trim().replace(/\s+/g, ' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={wrapperClass}>
      {icon && (
        <span className={styles['icon-wrapper']} aria-hidden="true">
          {icon}
        </span>
      )}
      
      <div className={styles['input-container']}>
        <input
          id={inputId}
          name={name || inputId}
          type={type}
          className={styles.input}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFloating ? placeholder : ''}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
        />
        
        <label htmlFor={inputId} className={labelClass}>
          {label}
          {required && <span className={styles.required} aria-label="required">*</span>}
        </label>
      </div>
      
      {error && (
        <span id={errorId} className={styles['error-message']} role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={helperId} className={styles['helper-text']}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
