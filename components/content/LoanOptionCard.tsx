import Link from 'next/link'
import { LoanOption } from '@/lib/types/content'
import styles from './LoanOptionCard.module.css'
import { FaHome, FaShieldAlt, FaFlag, FaTree, FaBuilding, FaKey, FaDollarSign, FaChartBar, FaSyncAlt, FaMoneyBillWave, FaStar } from 'react-icons/fa'
import { IconType } from 'react-icons'

export interface LoanOptionCardProps {
  loanOption: LoanOption
}

// Icon mapping for loan option types
const iconMap: Record<string, IconType> = {
  home: FaHome,
  shield: FaShieldAlt,
  flag: FaFlag,
  tree: FaTree,
  building: FaBuilding,
  key: FaKey,
  percent: FaDollarSign,
  chart: FaChartBar,
  refresh: FaSyncAlt,
  dollar: FaMoneyBillWave,
  star: FaStar
}

export default function LoanOptionCard({ loanOption }: LoanOptionCardProps) {
  const IconComponent = iconMap[loanOption.icon] || FaHome

  return (
    <Link
      href={`/loan-options/${loanOption.slug}`}
      className={styles.card}
      aria-label={`Learn more about ${loanOption.title}`}
    >
      <div className={styles.icon}>
        <IconComponent size={48} />
      </div>
      <h3 className={styles.title}>{loanOption.title}</h3>
      <p className={styles.description}>{loanOption.shortDescription}</p>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  )
}
