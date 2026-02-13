'use client'

import React from 'react'
import styles from './Input.module.css'

type Props = {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

export type InputProps = Props

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  fullWidth,
  disabled,
  inputMode
}: Props) {
  const hasLabel = Boolean(label && label.trim().length > 0)
  const hasIcon = Boolean(icon)

  return (
    <div
      className={[
        styles.field,
        fullWidth ? styles.fullWidth : '',
        hasIcon ? styles.hasIcon : '',
        hasLabel ? styles.hasLabel : styles.noLabel
      ].join(' ')}
    >
      {hasLabel && <label className={styles.label}>{label}</label>}

      <div className={styles.control}>
        {hasIcon && <span className={styles.icon}>{icon}</span>}

        <input
          className={styles.input}
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
