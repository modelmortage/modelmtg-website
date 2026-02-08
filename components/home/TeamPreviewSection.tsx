'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './TeamPreviewSection.module.css'

export default function TeamPreviewSection() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.2 })
    const [activeTeam, setActiveTeam] = useState(0)

    const teams = [
        {
            name: "Deal Structuring & Strategy",
            lead: "Matthew Bramow",
            role: "CEO & Lead Strategist",
            desc: "Architecting the loan before application. We identify leverage points to secure better terms."
        },
        {
            name: "Processing & Conditions",
            lead: "Sarah Collins",
            role: "Director of Operations",
            desc: "Proactive file cleanup. We clear conditions before the underwriter ever sees them."
        },
        {
            name: "Underwriting Liaison",
            lead: "Direct Access",
            role: "Senior Credit Officer",
            desc: "Rapid escalation channels for complex income and asset scenarios."
        },
        {
            name: "Closing Department",
            lead: "James Peterson",
            role: "Closing Manager",
            desc: "Ensuring docs are at title 48 hours before signing. No last-minute surprises."
        }
    ]

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                {/* LEFT: FIRM VISUAL */}
                <div className={styles.visualColumn}>
                    <div className={styles.imageFrame}>
                        {/* Placeholder for Team/Office Photo */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '2px'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', letterSpacing: '1px' }}>OFFICE / TEAM PHOTO</span>
                        </div>

                        <div className={styles.imageOverlay}></div>
                        <div className={styles.leaderLabel}>
                            <span className={styles.labelRole}>LEADERSHIP</span>
                            <span className={styles.labelName}>Matthew Bramow</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TEAM ROSTER */}
                <div className={styles.contentColumn}>
                    <h2 className={styles.headline}>
                        Your <br />
                        <span className={styles.goldText}>Deal Desk</span>
                    </h2>
                    <p className={styles.subtext}>
                        High-net-worth lending requires more than a loan officer. It requires a dedicated execution team.
                    </p>

                    <div className={styles.rosterList}>
                        {teams.map((team, index) => (
                            <div
                                key={index}
                                className={`${styles.rosterItem} ${activeTeam === index ? styles.active : ''}`}
                                onMouseEnter={() => setActiveTeam(index)}
                            >
                                <div className={styles.itemHeader}>
                                    <span className={styles.teamName}>{team.name}</span>
                                    <span className={styles.teamLead}>{team.lead}</span>
                                </div>
                                <div className={styles.itemDetail}>
                                    <p className={styles.teamDesc}>{team.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link href="/team" passHref legacyBehavior>
                            <a className="btn-link-gold">
                                Meet The Full Team <FaArrowRight className={styles.arrowIcon} />
                            </a>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}
