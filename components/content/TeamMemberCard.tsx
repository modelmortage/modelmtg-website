import Link from 'next/link'
import Image from 'next/image'
import { TeamMember } from '@/lib/types/content'
import { Card } from '@/components/design-system/Card'
import { Icon } from '@/components/design-system/Icon'
import { FaArrowRight, FaEnvelope, FaPhone } from 'react-icons/fa'
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
    <Card variant="elevated" padding="lg" hoverable>
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
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjdmNyIvPjwvc3ZnPg=="
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

          {/* Contact Info */}
          {(teamMember.contact.email || teamMember.contact.phone) && (
            <div className={styles.contactInfo}>
              {teamMember.contact.email && (
                <div className={styles.contactItem}>
                  <Icon icon={FaEnvelope} size="sm" />
                  <span>{teamMember.contact.email}</span>
                </div>
              )}
              {teamMember.contact.phone && (
                <div className={styles.contactItem}>
                  <Icon icon={FaPhone} size="sm" />
                  <span>{teamMember.contact.phone}</span>
                </div>
              )}
            </div>
          )}

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
          <div className={styles.arrow}>
            <span>Learn More</span>
            <Icon icon={FaArrowRight} size="sm" />
          </div>
        </div>
      </Link>
    </Card>
  )
}
