import type { Metadata } from 'next'
import ContentPage from '@/components/shared/ContentPage'
import TeamMemberCard from '@/components/content/TeamMemberCard'
import { meetOurTeamContent } from '@/lib/content/teamMembers'
import styles from './meet-our-team.module.css'

export const metadata: Metadata = {
  title: meetOurTeamContent.metadata.title,
  description: meetOurTeamContent.metadata.description,
  keywords: meetOurTeamContent.metadata.keywords.join(', '),
  openGraph: {
    title: meetOurTeamContent.metadata.title,
    description: meetOurTeamContent.metadata.description,
    type: 'website',
    images: meetOurTeamContent.metadata.ogImage ? [{ url: meetOurTeamContent.metadata.ogImage }] : undefined,
  },
  alternates: {
    canonical: meetOurTeamContent.metadata.canonical,
  },
}

export default function MeetOurTeamPage() {
  return (
    <ContentPage
      title={meetOurTeamContent.hero.title}
      subtitle={meetOurTeamContent.hero.subtitle}
      cta={{
        title: 'Ready to Work With Us?',
        description: 'Schedule a call with one of our mortgage professionals to discuss your homeownership goals.',
        buttonText: 'Schedule a Call',
        buttonHref: '/contact'
      }}
    >
      {/* Introduction */}
      <div className={styles.intro}>
        <p className={styles.introText}>{meetOurTeamContent.intro}</p>
      </div>

      {/* Team Members Grid */}
      <section className={styles.teamSection}>
        <div className={styles.teamGrid}>
          {meetOurTeamContent.teamMembers.map((member) => (
            <TeamMemberCard key={member.slug} teamMember={member} />
          ))}
        </div>
      </section>

      {/* Company Info */}
      <section className={styles.companyInfo}>
        <p className={styles.companyNmls}>Company NMLS: 2516810</p>
      </section>
    </ContentPage>
  )
}
