import Link from 'next/link'
import { LoanOption } from '@/lib/types/content'
import styles from './LoanOptionCard.module.css'

export interface LoanOptionCardProps {
  loanOption: LoanOption
}

// Icon mapping for loan option types
const iconMap: Record<string, string> = {
  home: '🏠',
  shield: '🛡️',
  flag: '🇺🇸',
  tree: '🌳',
  building: '🏢',
  key: '🔑',
  percent: '💰',
  chart: '📊',
  refresh: '🔄',
  dollar: '💵',
  star: '⭐'
}

export default function LoanOptionCard({ loanOption }: LoanOptionCardProps) {
  const icon = iconMap[loanOption.icon] || '🏠'

  return (
    <Link
      href={`/loan-options/${loanOption.slug}`}
      className={styles.card}
      aria-label={`Learn more about ${loanOption.title}`}
    >
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{loanOption.title}</h3>
      <p className={styles.description}>{loanOption.shortDescription}</p>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  )
}
