'use client'

import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './HowItWorksSection.module.css'
import { FaClipboardCheck, FaFileContract, FaKey } from 'react-icons/fa'
import { Icon } from '@/components/design-system'

const steps = [
    {
        number: '01',
        title: 'The Strategy Call',
        description: 'We analyze your income, assets, and timeline to build a custom financing roadmap.',
        icon: FaClipboardCheck
    },
    {
        number: '02',
        title: 'Precision Pre-Approval',
        description: 'Fast underwriting and clean documentation to help you win in competitive markets.',
        icon: FaFileContract
    },
    {
        number: '03',
        title: 'Lock & Close',
        description: 'Dedicated processing, weekly updates, and a seamless closing experience.',
        icon: FaKey
    }
]

export default function HowItWorksSection() {
    const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.2 })

    return (
        <section className={styles.section} ref={ref as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>The Model Mortgage Advantage</h2>
                    <p className={styles.subtitle}>A streamlined, transparent process designed for certainty.</p>
                </div>

                <div className={styles.stepsGrid}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.stepCard} style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.iconWrapper}>
                                <Icon icon={step.icon} size="lg" color="#D4AF37" />
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
