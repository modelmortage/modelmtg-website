'use client'

import { useEffect } from 'react'
import styles from './ElfsightWidget.module.css'

export function ElfsightWidget() {
  useEffect(() => {
    // Load Elfsight script if not already loaded
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')
    
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://elfsightcdn.com/platform.js'
      script.async = true
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup is handled by the script itself
    }
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Client Testimonials</span>
          <h2 className={styles.title}>
            More <span className={styles.titleAccent}>Reviews</span>
          </h2>
        </div>
        
        <div className={styles.widgetWrapper}>
          <div className="elfsight-app-4222637f-f2ae-46fa-a51b-ac25d83cd4be" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  )
}
