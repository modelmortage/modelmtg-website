import Link from 'next/link'
import Image from 'next/image'
import { TeamMember } from '@/lib/types/content'
import styles from './TeamMemberCard.module.css'

export interface TeamMemberCardProps {
  teamMember: TeamMember
}

/**
 * TeamMemberCard component displays a preview card for a team member
 * Shows photo, name, title, bio excerpt, and specialties
 * Responsive design with hover effects
 */
export default function TeamMemberCard({ teamMember }: TeamMemberCardProps) {
  // Truncate bio to first 150 characters for preview
  const bioExcerpt = teamMember.bio.length > 150 
    ? teamMember.bio.substring(0, 150).trim() + '...'
    : teamMember.bio

  return (
    <Link
      href={`/${teamMember.slug}`}
      className={styles.card}
      aria-label={`Learn more about ${teamMember.name}`}
    >
      {/* Photo */}
      <div className={styles.imageContainer}>
        <Image
          src={teamMember.photo}
          alt={teamMember.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Name */}
        <h2 className={styles.name}>{teamMember.name}</h2>

        {/* Title */}
        <p className={styles.title}>{teamMember.title}</p>

        {/* Bio Excerpt */}
        <p className={styles.bio}>{bioExcerpt}</p>

        {/* Specialties */}
        {teamMember.specialties.length > 0 && (
          <div className={styles.specialties}>
            <span className={styles.specialtiesLabel}>Specialties:</span>
            <ul className={styles.specialtiesList}>
              {teamMember.specialties.slice(0, 3).map((specialty, index) => (
                <li key={index} className={styles.specialty}>
                  {specialty}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Learn More Arrow */}
        <span className={styles.arrow} aria-hidden="true">→</span>
      </div>
    </Link>
  )
}
