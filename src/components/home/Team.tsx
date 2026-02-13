import Link from 'next/link'
import { siteData } from '@/src/lib/siteData'
import { homeSections } from '@/src/lib/homeSections'
import styles from './Team.module.css'

/**
 * Team Section - Local Credibility
 *
 * Shows Houston-based professionals with clean presentation
 */
export function Team() {
  const data = homeSections.team
  const { brand, team, compliance } = siteData
  const founder = team.founder

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{data.title}</h2>
          <p className={styles.intro}>
            {data.subtitle}
          </p>
        </div>

        {/* Placeholder for team photos - can be expanded later */}
        <div className={styles.teamGrid}>
          <div className={styles.teamMember}>
            <div className={styles.photoPlaceholder}>{founder.name.charAt(0)}{founder.name.split(' ')[1].charAt(0)}</div>
            <h3>{founder.name}</h3>
            <p className={styles.title}>{founder.title}</p>
            <p className={styles.nmls}>NMLS #{founder.nmls}</p>
          </div>
        </div>


      </div>
    </section>
  )
}

