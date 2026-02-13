'use client'

import { motion } from 'framer-motion'
import styles from './LocationMap.module.css'

export function LocationMap() {
  return (
    <section className={styles.section} aria-labelledby="location-heading">
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className={styles.textContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.label}>Visit Us</span>
            <h2 id="location-heading" className={styles.title}>
              Our Houston Location
            </h2>
            <div className={styles.divider}></div>
            <address className={styles.address}>
              <p className={styles.addressLine}>Model Mortgage</p>
              <p className={styles.addressLine}>Houston, Texas</p>
            </address>
          </motion.div>

          <motion.div 
            className={styles.mapWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d78089.54503581168!2d-95.57241972789747!3d30.119868118189153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864733895d1c8395%3A0xbbb0ce758dea754e!2sModel%20Mortgage!5e0!3m2!1sen!2sus!4v1771006731029!5m2!1sen!2sus"
              className={styles.map}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Model Mortgage location in Houston, Texas"
              aria-label="Google Maps showing Model Mortgage office location in Houston, Texas"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
