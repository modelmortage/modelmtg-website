import React, { ReactNode } from 'react';
import styles from './Section.module.css';

type SectionVariant = 'ink' | 'inkSoft' | 'dataStrip' | 'splitBleed' | 'narrow' | 'editorialLeft' | 'editorialRight';

interface SectionProps {
  variant: SectionVariant;
  children: ReactNode;
  className?: string;
  id?: string;
  topRule?: boolean;
}

/**
 * Section Component - Editorial Layout Architecture
 *
 * Variants control background, spacing, and container styling:
 * - 'ink': Standard dark background (mm-ink), py-28
 * - 'inkSoft': Alternate light dark background (mm-inkSoft), py-28
 * - 'dataStrip': Compact data section (mm-ink), py-20, narrow container
 * - 'splitBleed': Full-bleed left side for images (mm-ink), no left padding
 * - 'narrow': Narrow editorial container (mm-ink), py-24
 * - 'editorialLeft': 2-col layout with left ~40%, right ~60%
 * - 'editorialRight': 2-col layout with left ~60%, right ~40% (inverse)
 */
const Section = ({ variant, children, className = '', id, topRule = false }: SectionProps) => {
  const getVariantClass = (v: SectionVariant): string => {
    switch (v) {
      case 'ink':
        return styles.sectionInk;
      case 'inkSoft':
        return styles.sectionInkSoft;
      case 'dataStrip':
        return styles.sectionDataStrip;
      case 'splitBleed':
        return styles.sectionSplitBleed;
      case 'narrow':
        return styles.sectionNarrow;
      case 'editorialLeft':
        return styles.sectionEditorialLeft;
      case 'editorialRight':
        return styles.sectionEditorialRight;
      default:
        return styles.sectionInk;
    }
  };

  const ruleClass = topRule ? styles.withTopRule : '';

  return (
    <section
      id={id}
      className={`${getVariantClass(variant)} ${ruleClass} ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;

/**
 * Editorial column for editorialLeft/Right layouts
 * Use inside Section with variant="editorialLeft" or "editorialRight"
 */
interface EditorialColProps {
  position?: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

export function EditorialCol({
  position = 'left',
  children,
  className = '',
}: EditorialColProps) {
  const posClass = position === 'left' ? styles.colLeft : styles.colRight;
  return (
    <div className={`${posClass} ${className}`}>
      {children}
    </div>
  );
}
