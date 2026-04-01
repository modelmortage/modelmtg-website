'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import styles from './contact.module.css'

export default function ContactTitle() {
    return (
        <div className={styles.titleWrapper}>
            <h1 className={styles.title}>
                Begin the <br />
                <span className={styles.titleAccent}>Conversation</span>
            </h1>
            <div className={styles.titleLottie}>
                <DotLottieReact
                    src="/email.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    )
}
