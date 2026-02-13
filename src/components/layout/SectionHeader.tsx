import React, { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: string;
  align?: 'left' | 'center';
  rule?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * SectionHeader Component - Editorial section heading
 *
 * Supports:
 * - eyebrow: small uppercase label (using mm-kicker style)
 * - title: H2 heading
 * - subtitle: optional paragraph below title
 * - aside: optional small muted text (right aligned on desktop)
 * - rule: optional divider line (gold or border)
 * - align: 'left' | 'center'
 */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  aside,
  align = 'center',
  rule = false,
  className = '',
  children,
}: SectionHeaderProps) => {
  const alignClass = align === 'left' ? styles.headerLeft : styles.headerCenter;
  const ruleClass = rule ? styles.withRule : '';

  return (
    <header className={`${styles.header} ${alignClass} ${ruleClass} ${className}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}

      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>{title}</h2>
        {aside && <p className={styles.aside}>{aside}</p>}
      </div>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {rule && <div className={styles.divider} />}

      {children}
    </header>
  );
};

export default SectionHeader;

