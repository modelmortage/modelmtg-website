import React from 'react'
import Link from 'next/link'
import styles from './InlineCta.module.css'

interface InlineCtaProps {
    title: string
    description?: string
    buttonText: string
    buttonHref: string
}

export default function InlineCta({
    title,
    description,
    buttonText,
    buttonHref,
}: InlineCtaProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                {description && <p className={styles.description}>{description}</p>}
            </div>
            <div className={styles.action}>
                <Link href={buttonHref} className="btn btn-primary">
                    {buttonText}
                </Link>
            </div>
        </div>
    )
}
