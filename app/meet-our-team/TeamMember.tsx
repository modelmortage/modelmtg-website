'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#4caf50" opacity="0.15" />
        <path d="M4.5 8.5l2.5 2.5 4-5" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#c5a059" opacity="0.15" />
        <path d="M5 6.5h6M8 6.5V10m-2-1.5a2 2 0 104 0 2 2 0 00-4 0z" stroke="#c5a059" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
)

const BuildingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#546e7a" opacity="0.15" />
        <path d="M4 12V6l4-2 4 2v6H4zm3-4h2m-2 2h2" stroke="#546e7a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export type BulletType = 'check' | 'camera' | 'building'

export interface BulletItem {
    icon: BulletType
    text: string
}

export interface TeamMemberProps {
    imageSrc: string
    imageAlt: string
    role: string
    name: string
    nmls: string
    bioTitle: string
    bio: string
    bullets: BulletItem[]
    profileHref: string
    reversed?: boolean
}

const iconMap: Record<BulletType, React.ReactNode> = {
    check: <CheckIcon />,
    camera: <CameraIcon />,
    building: <BuildingIcon />,
}

export function TeamMember({ imageSrc, imageAlt, role, name, nmls, bioTitle, bio, bullets, profileHref, reversed }: TeamMemberProps) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '80px',
                alignItems: 'flex-start',
                direction: reversed ? 'rtl' : 'ltr',
            }}
            className="team-member-grid"
        >
            {/* Portrait + nameplate */}
            <div style={{ direction: 'ltr' }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '3/4',
                        maxHeight: '380px',
                        overflow: 'hidden',
                        background: '#e0e0e0',
                    }}
                >
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={420}
                        height={380}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 15%',
                            filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
                            transition: 'filter 0.5s ease',
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    />
                </div>
                {/* Nameplate below image */}
                <div style={{ marginTop: '16px' }}>
                    <span
                        style={{
                            display: 'block',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#c5a059',
                            marginBottom: '4px',
                        }}
                    >
                        {role}
                    </span>
                    <h2
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.9rem',
                            fontWeight: 400,
                            color: '#1a1a1a',
                            margin: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        {name}
                    </h2>
                    <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{nmls}</p>
                </div>
            </div>

            {/* Bio */}
            <div style={{ direction: 'ltr', paddingTop: '8px' }}>
                <h3
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                        color: '#1a1a1a',
                        marginBottom: '12px',
                        fontWeight: 400,
                    }}
                >
                    {bioTitle}
                </h3>
                <p
                    style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.75,
                        color: '#6b6b6b',
                        marginBottom: '24px',
                    }}
                >
                    {bio}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {bullets.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {iconMap[b.icon]}
                            <span style={{ fontSize: '0.8rem', color: '#1a1a1a' }}>{b.text}</span>
                        </div>
                    ))}
                </div>
                <Link
                    href={profileHref}
                    style={{
                        display: 'inline-block',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#c5a059',
                        borderBottom: '2px solid rgba(197,160,89,0.25)',
                        paddingBottom: '3px',
                        textDecoration: 'none',
                    }}
                >
                    View Full Profile
                </Link>
            </div>
        </div>
    )
}
